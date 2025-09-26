// pages/admin/master-data/item-keuangan/create.jsx
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import SelectInput from "@/components/ui/inputs/SelectInput";
import TextInput from "@/components/ui/inputs/TextInput";
import TextAreaInput from "@/components/ui/inputs/TextAreaInput";
import NumberInput from "@/components/ui/inputs/NumberInput";

const itemKeuanganService = {
  create: async (data) => {
    const response = await axios.post("/api/keuangan/item", data);

    return response.data;
  },
  getByKategoriAndPeriode: async (kategoriId, periodeId) => {
    const response = await axios.get(
      `/api/keuangan/item?kategoriId=${kategoriId}&periodeId=${periodeId}`
    );

    return response.data;
  },
};

export default function CreateItemKeuanganPage() {
  const router = useRouter();
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedPeriode, setSelectedPeriode] = useState("");
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
  const { data: existingItems, refetch: refetchItems } = useQuery({
    queryKey: ["existing-items", selectedKategori, selectedPeriode],
    queryFn: () =>
      itemKeuanganService.getByKategoriAndPeriode(
        selectedKategori,
        selectedPeriode
      ),
    enabled: !!(selectedKategori && selectedPeriode),
  });

  // Initialize dengan item level 1 jika belum ada
  useEffect(() => {
    if (selectedKategori && selectedPeriode && existingItems?.data?.items) {
      const existing = existingItems.data.items;

      if (existing.length === 0) {
        // Kategori kosong, buat item level 1 pertama
        setItems([
          {
            id: "temp_1",
            level: 1,
            kode: "A",
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
      } else {
        // Convert existing items ke format tree
        setItems(buildTreeFromExisting(existing));
      }
    }
  }, [selectedKategori, selectedPeriode, existingItems]);

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
        targetFrekuensi: item.targetFrekuensi || "",
        satuanFrekuensi: item.satuanFrekuensi || "",
        nominalSatuan: item.nominalSatuan || "",
        totalTarget: item.totalTarget || "",
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

    // Get kategori kode for update
    const selectedKat = kategoriOptions?.data?.find(
      (k) => k.id === selectedKategori
    );
    const kategoriKode = selectedKat?.kode || "A";

    setItems(updateKodes(updatedItems, "", 1, kategoriKode));
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
      // Flatten items untuk save ke database
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
            savedItem = await axios.patch(
              `/api/keuangan/item/${item.id}`,
              itemData
            );
            savedItem = savedItem.data;
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

      toast.success("Item keuangan berhasil disimpan");
      router.push("/admin/data-master/keuangan/item");
    } catch (error) {
      console.error("Error saving items:", error);
      toast.error(error.response?.data?.message || "Gagal menyimpan data");
    } finally {
      setSaving(false);
    }
  };

  // Render item form
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
                <span className="text-sm text-gray-500 dark:text-gray-400">
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
                <TextInput
                  label="Nama Item"
                  placeholder="Contoh: Persembahan Perpuluhan"
                  value={item.nama}
                  onChange={(value) => updateItem(item.id, "nama", value)}
                  required
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <TextAreaInput
                  label="Deskripsi"
                  placeholder="Deskripsi detail item"
                  rows={2}
                  value={item.deskripsi}
                  onChange={(value) => updateItem(item.id, "deskripsi", value)}
                />
              </div>

              {/* Target Frekuensi */}
              <div>
                <NumberInput
                  label="Target Frekuensi"
                  placeholder="12"
                  value={item.targetFrekuensi}
                  onChange={(value) => updateItem(item.id, "targetFrekuensi", value)}
                />
              </div>

              {/* Satuan Frekuensi */}
              <div>
                <SelectInput
                  label="Satuan Frekuensi"
                  placeholder="Pilih satuan"
                  value={item.satuanFrekuensi}
                  onChange={(value) => updateItem(item.id, "satuanFrekuensi", value)}
                  options={[
                    { value: "Kali", label: "Kali" },
                    { value: "Bulan", label: "Per Bulan" },
                    { value: "Tahun", label: "Per Tahun" },
                    { value: "Minggu", label: "Per Minggu" },
                    { value: "Hari", label: "Per Hari" }
                  ]}
                />
              </div>

              {/* Nominal Satuan */}
              <div>
                <NumberInput
                  label="Nominal Per Satuan"
                  placeholder="1000000"
                  value={item.nominalSatuan}
                  onChange={(value) => updateItem(item.id, "nominalSatuan", value)}
                />
              </div>

              {/* Total Target */}
              <div>
                <NumberInput
                  label="Total Target Anggaran"
                  placeholder="12000000"
                  value={item.totalTarget}
                  onChange={(value) => updateItem(item.id, "totalTarget", value)}
                />
                {item.targetFrekuensi && item.nominalSatuan && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buat Item Keuangan</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Buat struktur hierarkis item keuangan
            </p>
          </div>
        </div>

        <Button
          className="min-w-32"
          disabled={saving || !selectedKategori || !selectedPeriode}
          onClick={saveItems}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>

      {/* Pilih Kategori dan Periode */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pilih Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <SelectInput
              placeholder="Pilih kategori keuangan"
              value={selectedKategori}
              onChange={(value) => setSelectedKategori(value)}
              options={kategoriOptions?.data?.map((cat) => ({
                value: cat.id,
                label: `${cat.kode} - ${cat.nama}`
              })) || []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pilih Periode Anggaran</CardTitle>
          </CardHeader>
          <CardContent>
            <SelectInput
              placeholder="Pilih periode anggaran"
              value={selectedPeriode}
              onChange={(value) => setSelectedPeriode(value)}
              options={periodeOptions?.data?.map((periode) => ({
                value: periode.value,
                label: periode.label
              })) || []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Form Items */}
      {selectedKategori && selectedPeriode && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Struktur Item Keuangan</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  );
}
