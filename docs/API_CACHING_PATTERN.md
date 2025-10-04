# API Caching Pattern - Lazy Loading dengan React Query

## 📋 Overview

Dokumen ini menjelaskan pattern untuk **lazy loading dan caching API calls** yang digunakan di project ini. Pattern ini memastikan API hanya di-hit **saat dibutuhkan** dan **data di-cache** untuk menghindari duplicate API calls.

---

## 🎯 Tujuan

1. **Lazy Loading** - API hanya di-hit saat user action, bukan saat component mount
2. **Smart Caching** - Data di-cache untuk menghindari duplicate calls
3. **Better Performance** - Reduce network requests dan loading time
4. **Better UX** - User tidak perlu tunggu loading berulang kali

---

## 🏗️ Arsitektur Pattern

### 1. **React Query Setup**

```javascript
const {
  data: rayonQueryData,
  isLoading: rayonLoading,
  refetch: refetchRayon
} = useQuery({
  queryKey: ["rayon-options"],
  queryFn: async () => {
    const response = await rayonService.getRayon({ limit: 1000 });
    const options = response.data?.items?.map((rayon) => ({
      value: rayon.id,
      label: rayon.namaRayon,
    })) || [];
    return options;
  },
  enabled: false,              // ⚠️ PENTING: Tidak auto-fetch saat mount
  staleTime: 5 * 60 * 1000,    // Cache valid selama 5 menit
  cacheTime: 10 * 60 * 1000,   // Keep in memory 10 menit
});
```

**Penjelasan Parameter:**
- `queryKey`: Unique key untuk cache identity
- `queryFn`: Function untuk fetch data dari API
- `enabled: false`: **KUNCI UTAMA** - Mencegah auto-fetch
- `staleTime: 5 menit`: Data dianggap "fresh" selama 5 menit
- `cacheTime: 10 menit`: Data tetap di memory 10 menit

---

### 2. **Local State Sync**

```javascript
const [rayonOptions, setRayonOptions] = useState([]);

useEffect(() => {
  if (rayonQueryData) {
    setRayonOptions(rayonQueryData);
  }
}, [rayonQueryData]);
```

**Kenapa perlu local state?**
- React Query data hanya tersedia di scope tertentu
- Local state bisa di-pass ke child components dengan mudah
- Lebih mudah untuk conditional checking

---

### 3. **Smart Load Function**

```javascript
const loadRayonOptions = () => {
  if (rayonOptions.length > 0) return; // ✅ Already cached
  refetchRayon();                       // ❌ Not cached, fetch now
};
```

**Flow Logic:**
```
loadRayonOptions() dipanggil
    ↓
Cek: rayonOptions.length > 0?
    ↓                    ↓
   YES                  NO
    ↓                    ↓
  RETURN          refetchRayon()
(pakai cache)     (hit API)
```

---

### 4. **Handler untuk Trigger Load**

```javascript
const handleEditClick = (item) => {
  // Load options SEBELUM buka modal
  loadJemaatOptions();
  loadRayonOptions();
  setEditItem(item);
};
```

**Kenapa di handler, bukan di useEffect?**

❌ **useEffect Approach:**
```javascript
useEffect(() => {
  if (editItem) {
    loadRayonOptions();
  }
}, [editItem]);
```
- Runs SETELAH render
- Less explicit
- Bisa cause extra re-render
- Sulit di-debug

✅ **Handler Approach:**
```javascript
const handleEditClick = (item) => {
  loadRayonOptions();
  setEditItem(item);
};
```
- Runs SEBELUM render
- Explicit dan clear
- No extra re-render
- Easy to debug

---

## 🔄 Cache Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERACTIONS                     │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Klik "Edit" → handleEditClick() → loadRayonOptions()   │
└─────────────────────────────────────────────────────────┘
                            ↓
                   ┌────────────────┐
                   │ Cache Check    │
                   └────────────────┘
                            ↓
            ┌───────────────┴───────────────┐
            ↓                               ↓
    ┌─────────────┐                 ┌─────────────┐
    │ Cache HIT   │                 │ Cache MISS  │
    │ (length>0)  │                 │ (length=0)  │
    └─────────────┘                 └─────────────┘
            ↓                               ↓
    ┌─────────────┐                 ┌─────────────┐
    │ RETURN      │                 │ Hit API     │
    │ (No API)    │                 │ refetch()   │
    └─────────────┘                 └─────────────┘
            ↓                               ↓
    ┌─────────────┐                 ┌─────────────┐
    │ Use cached  │                 │ Save to     │
    │ data        │                 │ React Query │
    └─────────────┘                 └─────────────┘
            ↓                               ↓
            └───────────────┬───────────────┘
                            ↓
                   ┌────────────────┐
                   │ Sync to local  │
                   │ state          │
                   └────────────────┘
                            ↓
                   ┌────────────────┐
                   │ Modal terbuka  │
                   │ dengan options │
                   └────────────────┘
```

---

## 📊 Timeline Example

### Skenario: User membuka edit modal 3 kali

```
T+0s: User klik Edit (User A)
  → loadRayonOptions()
  → Check: rayonOptions.length = 0
  → Hit API ✅
  → Data saved: React Query + local state
  → Modal opened dengan options

T+10s: User tutup modal

T+15s: User klik Edit (User B)
  → loadRayonOptions()
  → Check: rayonOptions.length = 50
  → RETURN (no API call) ❌
  → Modal opened dengan cached options

T+20s: User tutup modal

T+25s: User klik Edit (User C)
  → loadRayonOptions()
  → Check: rayonOptions.length = 50
  → RETURN (no API call) ❌
  → Modal opened dengan cached options

T+5m: Cache stale (tapi masih di memory)
  → User klik Edit (User D)
  → loadRayonOptions()
  → Check: rayonOptions.length = 50
  → RETURN ❌
  → Modal opened dengan cached options
  → React Query refetch di BACKGROUND 🔄
  → User tetap lihat data lama (smooth UX)

T+10m: Cache cleared dari memory
  → Kembali ke skenario T+0s
```

---

## 🎨 Implementation Pattern

### Pattern 1: Modal dengan Select Input

```javascript
// 1. Setup React Query
const { data, isLoading, refetch } = useQuery({
  queryKey: ["options-key"],
  queryFn: fetchFunction,
  enabled: false,
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
});

// 2. Sync ke local state
const [options, setOptions] = useState([]);
useEffect(() => {
  if (data) setOptions(data);
}, [data]);

// 3. Load function
const loadOptions = () => {
  if (options.length > 0) return;
  refetch();
};

// 4. Handler
const handleOpenModal = (item) => {
  loadOptions();
  setModalItem(item);
};

// 5. Modal field
{
  key: "field",
  type: "select",
  options: options,
  loading: isLoading,
  onMenuOpen: loadOptions, // Fallback jika belum loaded
}
```

---

### Pattern 2: Form dengan Multiple Selects

```javascript
const handleEditClick = (item) => {
  // Load SEMUA options yang dibutuhkan
  loadJemaatOptions();
  loadRayonOptions();
  loadKeluargaOptions();

  setEditItem(item);
};
```

---

## ⚡ Performance Benefits

### Before (tanpa caching):

```
User buka edit 10x dalam 5 menit:
- API Calls: 10x
- Network: 10 MB
- Loading time: 10 x 500ms = 5 detik
```

### After (dengan caching):

```
User buka edit 10x dalam 5 menit:
- API Calls: 1x (9x pakai cache)
- Network: 1 MB
- Loading time: 500ms + 9 x 0ms = 500ms
```

**Improvement:**
- 90% less API calls
- 90% less bandwidth
- 90% faster UX

---

## 🚫 Anti-Pattern (Jangan Lakukan Ini!)

### ❌ Auto-fetch saat mount

```javascript
// JANGAN!
const { data } = useQuery({
  queryKey: ["rayon"],
  queryFn: fetchRayon,
  // enabled: true by default
});
```
**Masalah:** API di-hit meskipun user tidak buka modal

---

### ❌ Fetch di dalam modal

```javascript
// JANGAN!
<Modal>
  {isOpen && <SelectWithAPI />}
</Modal>
```
**Masalah:** API di-hit setiap kali modal dibuka

---

### ❌ useEffect untuk load

```javascript
// JANGAN!
useEffect(() => {
  loadOptions();
}, [modalOpen]);
```
**Masalah:** Extra re-render, timing issues

---

## ✅ Best Practices

1. **Always use `enabled: false`** untuk lazy queries
2. **Load di handler**, bukan di useEffect
3. **Check cache** sebelum refetch
4. **Set appropriate `staleTime`** - 5-10 menit untuk master data
5. **Set appropriate `cacheTime`** - 2x dari staleTime
6. **Use local state** untuk easy access
7. **Provide fallback `onMenuOpen`** di select input

---

## 🔧 Troubleshooting

### Problem: Options tidak muncul di modal

**Solusi:**
```javascript
// Pastikan loadOptions dipanggil SEBELUM modal dibuka
const handleOpen = (item) => {
  loadOptions();     // ← Panggil dulu
  setModalItem(item); // ← Baru set item
};
```

---

### Problem: API di-hit berulang kali

**Solusi:**
```javascript
// Pastikan ada cache check
const loadOptions = () => {
  if (options.length > 0) return; // ← Cache check
  refetch();
};
```

---

### Problem: Data tidak update setelah create/edit

**Solusi:**
```javascript
// Invalidate cache setelah mutation
onSuccess: () => {
  queryClient.invalidateQueries(["options-key"]);
}
```

---

## 📚 Files yang Menggunakan Pattern Ini

- `src/pages/admin/users/index.jsx` - Jemaat, Rayon, Keluarga options
- `src/pages/admin/jemaat/edit/[id].jsx` - Master data options

---

## 🎓 Learning Resources

- [React Query Docs - Lazy Queries](https://tanstack.com/query/latest/docs/react/guides/lazy-queries)
- [React Query Docs - Caching](https://tanstack.com/query/latest/docs/react/guides/caching)
- [React Query Docs - Initial Data](https://tanstack.com/query/latest/docs/react/guides/initial-query-data)

---

## 📝 Summary

**Key Points:**
1. ✅ Lazy load dengan `enabled: false`
2. ✅ Cache dengan `staleTime` dan `cacheTime`
3. ✅ Smart check sebelum fetch
4. ✅ Load di handler function, bukan useEffect
5. ✅ Sync ke local state untuk easy access

**Result:**
- 90% less API calls
- Better performance
- Better UX
- Less bandwidth

---

**Author:** Development Team
**Last Updated:** 2025-01-04
**Version:** 1.0
