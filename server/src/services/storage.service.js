import ImageKit, { toFile } from "@imagekit/nodejs";
import { config } from "../config/config.js";

const client = new ImageKit({
    privateKey: config.IMAGE_KIT_PRIVATE_KEY
})


export const uploadFiles = async ({ buffer, fileName }) => { 
    const response = await client.files.upload({
        file: await toFile(buffer),
        fileName: fileName,
        folder: "authentication-product-crud",
    });

    return response;
}




export const deleteFile = async (fieldId) => { 
    await client.files.delete(fieldId);
}