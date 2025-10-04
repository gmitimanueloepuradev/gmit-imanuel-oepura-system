# Quick Reference - API Caching Pattern

## 🚀 Quick Setup Guide

### Step 1: Setup React Query (3 menit)

```javascript
const {
  data: rayonQueryData,
  isLoading: rayonLoading,
  refetch: refetchRayon
} = useQuery({
  queryKey: ["rayon-options"],           // Unique cache key
  queryFn: async () => {
    // Fetch dan transform data
    const response = await service.getData();
    return response.data.items.map(item => ({
      value: item.id,
      label: item.name,
    }));
  },
  enabled: false,                         // ⚡ WAJIB!
  staleTime: 5 * 60 * 1000,              // 5 menit
  cacheTime: 10 * 60 * 1000,             // 10 menit
});
```

---

### Step 2: Sync ke Local State (1 menit)

```javascript
const [rayonOptions, setRayonOptions] = useState([]);

useEffect(() => {
  if (rayonQueryData) {
    setRayonOptions(rayonQueryData);
  }
}, [rayonQueryData]);
```

---

### Step 3: Create Load Function (1 menit)

```javascript
const loadRayonOptions = () => {
  if (rayonOptions.length > 0) return; // Cache check
  refetchRayon();                       // Fetch if empty
};
```

---

### Step 4: Use in Handler (30 detik)

```javascript
const handleEditClick = (item) => {
  loadRayonOptions();  // Load sebelum buka modal
  setEditItem(item);
};
```

---

### Step 5: Use in Form Field (1 menit)

```javascript
{
  key: "idRayon",
  label: "Pilih Rayon",
  type: "select",
  options: rayonOptions,        // Dari local state
  loading: rayonLoading,        // Loading indicator
  onMenuOpen: loadRayonOptions, // Fallback load
}
```

---

## 📋 Copy-Paste Template

### Template untuk Option Baru

```javascript
// 1. React Query
const {
  data: [NAME]QueryData,
  isLoading: [NAME]Loading,
  refetch: refetch[NAME]
} = useQuery({
  queryKey: ["[name]-options"],
  queryFn: async () => {
    const response = await [service].get[NAME]();
    return response.data?.items?.map((item) => ({
      value: item.id,
      label: item.name, // sesuaikan field
    })) || [];
  },
  enabled: false,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});

// 2. Local State
const [[name]Options, set[NAME]Options] = useState([]);

// 3. Sync Effect
useEffect(() => {
  if ([NAME]QueryData) {
    set[NAME]Options([NAME]QueryData);
  }
}, [[NAME]QueryData]);

// 4. Load Function
const load[NAME]Options = () => {
  if ([name]Options.length > 0) return;
  refetch[NAME]();
};
```

**Contoh Konkret:**
```javascript
// Replace [NAME] = Suku, [name] = suku, [service] = masterService

const {
  data: sukuQueryData,
  isLoading: sukuLoading,
  refetch: refetchSuku
} = useQuery({
  queryKey: ["suku-options"],
  queryFn: async () => {
    const response = await masterService.getSuku();
    return response.data?.items?.map((item) => ({
      value: item.id,
      label: item.namaSuku,
    })) || [];
  },
  enabled: false,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});

const [sukuOptions, setSukuOptions] = useState([]);

useEffect(() => {
  if (sukuQueryData) {
    setSukuOptions(sukuQueryData);
  }
}, [sukuQueryData]);

const loadSukuOptions = () => {
  if (sukuOptions.length > 0) return;
  refetchSuku();
};
```

---

## 🎯 Cheat Sheet

### When to Use This Pattern?

✅ **YES:**
- Master data (Rayon, Suku, Pendidikan, dll)
- Dropdown options yang jarang berubah
- Data yang digunakan di multiple modals
- List yang sering diakses user

❌ **NO:**
- Real-time data (chat, notifications)
- Data yang sering berubah (stock, live score)
- One-time fetch (user detail)
- Infinite scroll list

---

### Cache Duration Guidelines

```javascript
// Master Data (Rayon, Suku, Pendidikan)
staleTime: 5 * 60 * 1000,    // 5 menit
cacheTime: 10 * 60 * 1000,   // 10 menit

// Dynamic Data (Users, Jemaat)
staleTime: 1 * 60 * 1000,    // 1 menit
cacheTime: 3 * 60 * 1000,    // 3 menit

// Static Data (Settings, Config)
staleTime: 30 * 60 * 1000,   // 30 menit
cacheTime: 60 * 60 * 1000,   // 60 menit
```

---

## 🐛 Common Mistakes & Fixes

### Mistake 1: Lupa `enabled: false`

```javascript
// ❌ SALAH
const { data } = useQuery({
  queryKey: ["rayon"],
  queryFn: fetchRayon,
});
// API akan hit otomatis saat component mount!

// ✅ BENAR
const { data } = useQuery({
  queryKey: ["rayon"],
  queryFn: fetchRayon,
  enabled: false, // ← Tambahkan ini!
});
```

---

### Mistake 2: Tidak ada cache check

```javascript
// ❌ SALAH
const loadOptions = () => {
  refetch(); // Selalu hit API!
};

// ✅ BENAR
const loadOptions = () => {
  if (options.length > 0) return; // ← Cache check
  refetch();
};
```

---

### Mistake 3: Load di useEffect

```javascript
// ❌ SALAH
useEffect(() => {
  if (modalOpen) {
    loadOptions();
  }
}, [modalOpen]);

// ✅ BENAR
const handleOpenModal = () => {
  loadOptions();
  setModalOpen(true);
};
```

---

### Mistake 4: Pakai apiEndpoint di AutoComplete

```javascript
// ❌ SALAH - Hit API setiap kali modal dibuka
{
  type: "custom",
  component: AutoCompleteInput,
  apiEndpoint: "/rayon/options", // ← Tidak di-cache!
}

// ✅ BENAR - Pakai cached options
{
  type: "select",
  options: rayonOptions,         // ← Dari cache
  loading: rayonLoading,
  onMenuOpen: loadRayonOptions,
}
```

---

## 📊 Testing Cache

### Test Manual di Browser Console

```javascript
// 1. Buka modal pertama kali
// Cek Network tab → Harus ada API call

// 2. Tutup modal

// 3. Buka modal lagi
// Cek Network tab → TIDAK ada API call

// 4. Check cache
console.log(rayonOptions); // Should have data
console.log(rayonOptions.length); // Should be > 0
```

---

### Test dengan React Query DevTools

```javascript
// Install React Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Di App component
<ReactQueryDevtools initialIsOpen={false} />
```

**Features:**
- Lihat semua queries
- Lihat cache status (fresh/stale)
- Manual refetch
- Invalidate cache
- Clear cache

---

## 🔄 Cache Invalidation

### When to Invalidate?

```javascript
// Setelah CREATE
const createMutation = useMutation({
  mutationFn: createData,
  onSuccess: () => {
    queryClient.invalidateQueries(["rayon-options"]);
  }
});

// Setelah UPDATE
const updateMutation = useMutation({
  mutationFn: updateData,
  onSuccess: () => {
    queryClient.invalidateQueries(["rayon-options"]);
  }
});

// Setelah DELETE
const deleteMutation = useMutation({
  mutationFn: deleteData,
  onSuccess: () => {
    queryClient.invalidateQueries(["rayon-options"]);
  }
});
```

---

## 💡 Pro Tips

### Tip 1: Multiple Options di Satu Modal

```javascript
const handleEditClick = (item) => {
  // Load SEMUA options sekaligus
  loadJemaatOptions();
  loadRayonOptions();
  loadSukuOptions();
  setEditItem(item);
};
```

---

### Tip 2: Conditional Load

```javascript
const handleEditClick = (item) => {
  loadRayonOptions(); // Always load

  // Only load jemaat if role is JEMAAT
  if (item.role === "JEMAAT") {
    loadJemaatOptions();
  }

  setEditItem(item);
};
```

---

### Tip 3: Pre-load saat Hover

```javascript
const handleRowHover = (item) => {
  // Pre-load options saat user hover
  loadRayonOptions();
  loadJemaatOptions();
};

// Use di table row
<tr onMouseEnter={() => handleRowHover(item)}>
```

---

### Tip 4: Global Options Hook

```javascript
// hooks/useOptions.js
export const useOptions = () => {
  // Setup semua options di sini
  const rayonOptions = useRayonOptions();
  const sukuOptions = useSukuOptions();

  return {
    rayonOptions,
    sukuOptions,
    loadAll: () => {
      rayonOptions.load();
      sukuOptions.load();
    }
  };
};

// Di component
const options = useOptions();
options.loadAll();
```

---

## 📈 Performance Metrics

### Measure Impact

```javascript
// Before load
console.time('loadOptions');

loadRayonOptions();

// After load
console.timeEnd('loadOptions');

// First time: ~500ms (API call)
// Second time: ~0ms (cache hit)
```

---

## 🎓 Next Steps

1. ✅ Implement pattern untuk master data lain (Suku, Pendidikan, dll)
2. ✅ Add React Query DevTools untuk monitoring
3. ✅ Test cache invalidation setelah mutations
4. ✅ Monitor performance improvements
5. ✅ Document any edge cases

---

## 📞 Need Help?

**Common Questions:**

Q: Kapan sebaiknya invalidate cache?
A: Setelah CREATE, UPDATE, DELETE data

Q: Berapa lama sebaiknya cache duration?
A: Master data: 5-10 menit, Dynamic data: 1-3 menit

Q: Apa bedanya staleTime vs cacheTime?
A: staleTime = data dianggap fresh, cacheTime = data kept in memory

Q: Kenapa harus pakai local state juga?
A: Untuk easy access dan conditional checking

---

**Last Updated:** 2025-01-04
