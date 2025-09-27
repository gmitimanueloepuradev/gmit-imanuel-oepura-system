// pages/admin/data-master/keuangan/item/edit.jsx
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const itemKeuanganService = {
  create: async (data) => {
    const response = await axios.post("/api/keuangan/item", data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.patch(`/api/keuangan/item/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axios.delete(`/api/keuangan/item/${id}`);
    return response.data;
  },
  getByKategoriAndPeriode: async (kategoriId, periodeId) => {
    const response = await axios.get(
      `/api/keuangan/item?kategoriId=${kategoriId}&periodeId=${periodeId}`
    );
    return response.data;
  },
};

export default function EditItemKeuanganPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get periode and kategori from URL params
  const [selectedKategori, setSelectedKategori] = useState(searchParams?.get('kategoriId') || "");
  const [selectedPeriode, setSelectedPeriode] = useState(searchParams?.get('periodeId') || "");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  // Query untuk kategori options
  const { data: kategoriOptions } = useQuery({
    queryKey: ["kategori-keuangan-options"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/kategori/options");
      return response.data;
    },
  });

  // Query untuk periode options
  const { data: periodeOptions } = useQuery({
    queryKey: ["periode-anggaran-options"],
    queryFn: async () => {
      const response = await axios.get("/api/keuangan/periode/options");
      return response.data;
    },
  });

  // Query untuk existing items berdasarkan kategori dan periode
  const { data: existingItems } = useQuery({
    queryKey: ["existing-items", selectedKategori, selectedPeriode],
    queryFn: () => itemKeuanganService.getByKategoriAndPeriode(selectedKategori, selectedPeriode),
    enabled: !!(selectedKategori && selectedPeriode),
  });

  // Initialize items from existing data
  useEffect(() => {
    if (selectedKategori && selectedPeriode && existingItems?.data?.items) {
      const existing = existingItems.data.items;
      if (existing.length > 0) {
        // Convert existing items ke format tree untuk editing
        setItems(buildTreeFromExisting(existing));
      } else {
        // Jika tidak ada items, buat item level 1 pertama
        setItems([
          {
            id: "temp_1",
            level: 1,
            kode: getKategoriKode(),
            nama: "",
            deskripsi: "",
            targetFrekuensi: "",
            satuanFrekuensi: "",
            nominalSatuan: "",
            totalTarget: "",
            parentId: null,
            children: [],
          },
        ]);
      }
    }
  }, [selectedKategori, selectedPeriode, existingItems, kategoriOptions]);

  // Get kategori kode
  const getKategoriKode = () => {
    const selectedKat = kategoriOptions?.data?.find(
      (k) => k.id === selectedKategori
    );
    return selectedKat?.kode || "A";
  };

  // Build tree dari existing items
  const buildTreeFromExisting = (existingItems) => {
    const itemMap = new Map();
    const rootItems = [];

    // Buat map
    existingItems.forEach((item) => {
      itemMap.set(item.id, {
        ...item,
        children: [],
        id: item.id, // Keep real ID for existing items
        // Handle target fields - ensure they're properly mapped
        targetFrekuensi: item.targetFrekuensi ? item.targetFrekuensi.toString() : "",
        satuanFrekuensi: item.satuanFrekuensi || "",
        nominalSatuan: item.nominalSatuan ? item.nominalSatuan.toString() : "",
        totalTarget: item.totalTarget ? item.totalTarget.toString() : "",
      });
    });

    // Build tree
    existingItems.forEach((item) => {
      const itemWithChildren = itemMap.get(item.id);

      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(itemWithChildren);
        }
      } else {
        rootItems.push(itemWithChildren);
      }
    });

    return rootItems.sort((a, b) => a.urutan - b.urutan);
  };

  // Generate kode berdasarkan level dan urutan
  const generateKode = (parentKode, childIndex, level) => {
    if (level === 1) {
      // Level 1: A, B, C, dst
      return String.fromCharCode(65 + childIndex);
    } else {
      // Level 2+: A.1, A.1.1, A.1.1.1, dst
      return `${parentKode}.${childIndex + 1}`;
    }
  };

  // Update kode secara rekursif
  const updateKodes = (itemList, parentKode = "", startLevel = 1) => {
    return itemList.map((item, index) => {
      const newKode = generateKode(parentKode, index, item.level);
      const updatedItem = {
        ...item,
        kode: newKode,
        urutan: index + 1,
      };

      if (item.children && item.children.length > 0) {
        updatedItem.children = updateKodes(
          item.children,
          newKode,
          item.level + 1
        );
      }

      return updatedItem;
    });
  };

  // Add child item
  const addChild = (parentId, parentLevel) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const addChildToTree = (itemList) => {
      return itemList.map((item) => {
        if (item.id === parentId) {
          const newChild = {
            id: tempId,
            level: parentLevel + 1,
            kode: "", // Will be generated later
            nama: "",
            deskripsi: "",
            targetFrekuensi: "",
            satuanFrekuensi: "",
            nominalSatuan: "",
            totalTarget: "",
            parentId: parentId,
            children: [],
          };

          return {
            ...item,
            children: [...(item.children || []), newChild],
          };
        }

        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: addChildToTree(item.children),
          };
        }

        return item;
      });
    };

    const updatedItems = addChildToTree(items);
    setItems(updateKodes(updatedItems));
  };

  // Add sibling item
  const addSibling = (afterItemId, level) => {
    const tempId = `temp_${Date.now()}_${Math.random()}`;

    const addSiblingToTree = (itemList, targetLevel = 1) => {
      if (targetLevel === level) {
        // Find index of afterItem
        const afterIndex = itemList.findIndex(
          (item) => item.id === afterItemId
        );
        if (afterIndex !== -1) {
          const newSibling = {
            id: tempId,
            level: level,
            kode: "", // Will be generated later
            nama: "",
            deskripsi: "",
            targetFrekuensi: "",
            satuanFrekuensi: "",
            nominalSatuan: "",
            totalTarget: "",
            parentId: itemList[afterIndex].parentId,
            children: [],
          };

          const newList = [...itemList];
          newList.splice(afterIndex + 1, 0, newSibling);
          return newList;
        }
      }

      return itemList.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: addSiblingToTree(item.children, targetLevel),
          };
        }
        return item;
      });
    };

    let updatedItems;
    if (level === 1) {
      // Add sibling di root level
      const afterIndex = items.findIndex((item) => item.id === afterItemId);
      if (afterIndex !== -1) {
        const newSibling = {
          id: tempId,
          level: 1,
          kode: "",
          nama: "",
          deskripsi: "",
          targetFrekuensi: "",
          satuanFrekuensi: "",
          nominalSatuan: "",
          totalTarget: "",
          parentId: null,
          children: [],
        };

        updatedItems = [...items];
        updatedItems.splice(afterIndex + 1, 0, newSibling);
      }
    } else {
      updatedItems = addSiblingToTree(items, level);
    }

    setItems(updateKodes(updatedItems));
  };

  // Delete item
  const deleteItem = (itemId) => {
    const deleteFromTree = (itemList) => {
      return itemList
        .filter((item) => item.id !== itemId)
        .map((item) => ({
          ...item,
          children: item.children ? deleteFromTree(item.children) : [],
        }));
    };

    const updatedItems = deleteFromTree(items);
    setItems(updateKodes(updatedItems));
  };

  // Update item
  const updateItem = (itemId, field, value) => {
    const updateInTree = (itemList) => {
      return itemList.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };

          // Auto calculate totalTarget jika ada targetFrekuensi dan nominalSatuan
          if (field === "targetFrekuensi" || field === "nominalSatuan") {
            const freq =
              field === "targetFrekuensi" ? value : item.targetFrekuensi;
            const nominal =
              field === "nominalSatuan" ? value : item.nominalSatuan;

            if (freq && nominal && !isNaN(freq) && !isNaN(nominal)) {
              updatedItem.totalTarget = (
                parseFloat(freq) * parseFloat(nominal)
              ).toString();
            }
          }

          return updatedItem;
        }

        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children: updateInTree(item.children),
          };
        }

        return item;
      });
    };

    setItems(updateInTree(items));
  };

  // Save all items
  const saveItems = async () => {
    if (!selectedKategori) {
      toast.error("Pilih kategori terlebih dahulu");
      return;
    }

    if (!selectedPeriode) {
      toast.error("Pilih periode terlebih dahulu");
      return;
    }

    // Validate required fields
    const validateItems = (itemList) => {
      for (const item of itemList) {
        if (!item.nama.trim()) {
          throw new Error(`Nama item untuk kode ${item.kode} harus diisi`);
        }

        if (item.children && item.children.length > 0) {
          validateItems(item.children);
        }
      }
    };

    try {
      validateItems(items);
    } catch (error) {
      toast.error(error.message);
      return;
    }

    setSaving(true);

    try {
      // Get existing items to know which ones to delete
      const existingItemIds = existingItems?.data?.items?.map(item => item.id) || [];
      
      // Collect all current item IDs (excluding temp items)
      const getCurrentItemIds = (itemList) => {
        let ids = [];
        for (const item of itemList) {
          if (!item.id.startsWith("temp_")) {
            ids.push(item.id);
          }
          if (item.children && item.children.length > 0) {
            ids.push(...getCurrentItemIds(item.children));
          }
        }
        return ids;
      };

      const currentItemIds = getCurrentItemIds(items);
      
      // Find items to delete
      const itemsToDelete = existingItemIds.filter(id => !currentItemIds.includes(id));

      // Delete removed items
      for (const itemId of itemsToDelete) {
        await itemKeuanganService.delete(itemId);
      }

      // Flatten items untuk save/update ke database
      const flattenItems = async (itemList, parentRealId = null) => {
        let result = [];

        for (const item of itemList) {
          const itemData = {
            kategoriId: selectedKategori,
            periodeId: selectedPeriode,
            parentId: parentRealId,
            kode: item.kode,
            nama: item.nama,
            deskripsi: item.deskripsi || null,
            level: item.level,
            urutan: item.urutan,
            targetFrekuensi: item.targetFrekuensi
              ? parseInt(item.targetFrekuensi)
              : null,
            satuanFrekuensi: item.satuanFrekuensi || null,
            nominalSatuan: item.nominalSatuan
              ? parseFloat(item.nominalSatuan)
              : null,
            totalTarget: item.totalTarget ? parseFloat(item.totalTarget) : null,
            isActive: true,
          };

          // Save parent first
          let savedItem;
          if (item.id.startsWith("temp_")) {
            // New item
            savedItem = await itemKeuanganService.create(itemData);
          } else {
            // Existing item - update
            savedItem = await itemKeuanganService.update(item.id, itemData);
          }

          result.push(savedItem);

          // Save children dengan parent ID yang benar
          if (item.children && item.children.length > 0) {
            const childResults = await flattenItems(
              item.children, 
              savedItem.data?.id || savedItem.id
            );
            result.push(...childResults);
          }
        }

        return result;
      };

      await flattenItems(items);

      toast.success("Item keuangan berhasil diperbarui");
      router.push("/admin/data-master/keuangan/item");
    } catch (error) {
      console.error("Error saving items:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // Render item form (sama dengan create page)
  const renderItemForm = (item, level = 1, index = 0) => {
    const indentClass = level > 1 ? `ml-${(level - 1) * 8}` : "";

    return (
      <div key={item.id} className={`space-y-4 ${indentClass}`}>
        {/* Item Form */}
        <Card className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  {item.kode} (Level {item.level})
                </Badge>
                <span className="text-sm text-gray-500">
                  Urutan: {item.urutan}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => addChild(item.id, item.level)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Sub Item
                </Button>

                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => addSibling(item.id, item.level)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Sibling
                </Button>

                {items.length > 1 && (
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Item */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Nama Item *
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Persembahan Perpuluhan"
                  type="text"
                  value={item.nama}
                  onChange={(e) => updateItem(item.id, "nama", e.target.value)}
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Deskripsi
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi detail item"
                  rows="2"
                  value={item.deskripsi}
                  onChange={(e) =>
                    updateItem(item.id, "deskripsi", e.target.value)
                  }
                />
              </div>

              {/* Target Frekuensi */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Target Frekuensi
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="12"
                  type="number"
                  value={item.targetFrekuensi}
                  onChange={(e) =>
                    updateItem(item.id, "targetFrekuensi", e.target.value)
                  }
                />
              </div>

              {/* Satuan Frekuensi */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Satuan Frekuensi
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={item.satuanFrekuensi}
                  onChange={(e) =>
                    updateItem(item.id, "satuanFrekuensi", e.target.value)
                  }
                >
                  <option value="">Pilih satuan</option>
                  <option value="Kali">Kali</option>
                  <option value="Bulan">Per Bulan</option>
                  <option value="Tahun">Per Tahun</option>
                  <option value="Minggu">Per Minggu</option>
                  <option value="Hari">Per Hari</option>
                </select>
              </div>

              {/* Nominal Satuan */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nominal Per Satuan
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1000000"
                  type="number"
                  value={item.nominalSatuan}
                  onChange={(e) =>
                    updateItem(item.id, "nominalSatuan", e.target.value)
                  }
                />
              </div>

              {/* Total Target */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Target Anggaran
                </label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="12000000"
                  type="number"
                  value={item.totalTarget}
                  onChange={(e) =>
                    updateItem(item.id, "totalTarget", e.target.value)
                  }
                />
                {item.targetFrekuensi && item.nominalSatuan && (
                  <div className="text-xs text-gray-500 mt-1">
                    Auto: {item.targetFrekuensi} × {item.nominalSatuan} ={" "}
                    {(
                      parseFloat(item.targetFrekuensi || 0) *
                      parseFloat(item.nominalSatuan || 0)
                    ).toLocaleString("id-ID")}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render Children */}
        {item.children && item.children.length > 0 && (
          <div className="space-y-4">
            {item.children.map((child, childIndex) =>
              renderItemForm(child, level + 1, childIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  // Get current periode info
  const currentPeriodeInfo = periodeOptions?.data?.find(p => p.value === selectedPeriode);
  const currentKategoriInfo = kategoriOptions?.data?.find(k => k.id === selectedKategori);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Item Keuangan</h1>
            <p className="text-gray-600">
              Edit struktur hierarkis item keuangan untuk {currentKategoriInfo?.nama} - {currentPeriodeInfo?.label}
            </p>
          </div>
        </div>

        <Button
          className="min-w-32"
          disabled={saving || !selectedKategori || !selectedPeriode}
          onClick={saveItems}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Menyimpan..." : "Update"}
        </Button>
      </div>

      {/* Info Kategori dan Periode (Read-only) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{currentKategoriInfo?.kode} - {currentKategoriInfo?.nama}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Periode Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">{currentPeriodeInfo?.label}</span>
              {currentPeriodeInfo?.tanggalMulai && currentPeriodeInfo?.tanggalAkhir && (
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(currentPeriodeInfo.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(currentPeriodeInfo.tanggalAkhir).toLocaleDateString('id-ID')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Form Items */}
      {selectedKategori && selectedPeriode && items.length > 0 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Struktur Item Keuangan</CardTitle>
              <p className="text-sm text-gray-600">
                Kode akan di-generate otomatis berdasarkan hierarki dan urutan
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {items.map((item, index) => renderItemForm(item, 1, index))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading state */}
      {selectedKategori && selectedPeriode && items.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-gray-500">Memuat data...</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}