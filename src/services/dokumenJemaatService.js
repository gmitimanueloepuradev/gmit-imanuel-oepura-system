import axios from "@/lib/axios";

const dokumenJemaatService = {
  // Fetch documents with pagination and filters
  getDocuments: async (params = {}) => {
    const response = await axios.get("/dokumen-jemaat", { params });

    return response.data;
  },
};

export default dokumenJemaatService;
