import { axiosInstance } from "../../../lib/axiosInstance";

export const getPublishedProducts = async () => { 
    const response = await axiosInstance.get("/products");

    return response.data;
}



export const getProductById = async (id) => { 
    const response = await axiosInstance.get(`/products/${id}`);

    return response.data;
}



export const getSellerProducts = async () => { 
    const response = await axiosInstance.get(`/products/seller`);
    return response.data;
}




export const publishProductById = async (id) => { 
    const response = await axiosInstance.patch(`/products/list/${id}`);
    return response.data;
}


export const unPublishProductById = async (id) => { 
    const response = await axiosInstance.patch(`/products/unlist/${id}`);
    return response.data;
}


export const deleteProductById = async (id) => { 
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
}




export const createProduct = async (formData) => { 
    const response = await axiosInstance.post("/products", formData);
    return response.data;
}





export const updateProduct = async (id, formData) => { 
    const response = await axiosInstance.put(`/products/${id}`, formData);
    return response.data;
}