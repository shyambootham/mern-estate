import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../firebase";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  console.log(formData);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((error) => {
          setImageUploadError("image upload failed (2 mb max");
          setUploading(false);
        });
    } else {
      setImageUploadError("you can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`upload is ${progress}% done `);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4  flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            id="address"
            maxLength="62"
            minLength="10"
            required
          />
          <div className="flex gap-6">
            <div className="flex gap-2 items-center">
              <input type="checkbox" id="sale" className="w-5" />
              <span>sell</span>
            </div>
            <div className="flex gap-2  items-center">
              <input type="checkbox" id="rent" className="w-5" />
              <span>rent</span>
            </div>
            <div className="flex gap-2  items-center">
              <input type="checkbox" id="parking" className="w-5" />
              <span>parking spot</span>
            </div>
            <div className="flex gap-2  items-center">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2  items-center">
              <input type="checkbox" id="offer" className="w-5" />
              <span>offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
                className="p-3 border border-green rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="bathroom"
                min="1"
                max="10"
                required
                className="p-3 border border-green rounded-lg"
              />
              <p>baths</p>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-green rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>regular price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
            <div className="flex items-center gap-2 ">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 border border-green rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>discounted price</p>
                <span className="text-xs">($/months)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              first image will cover max(6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-grey-300 rounded w-full"
              type="file"
              id="image"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "uploading" : "upload"}
            </button>
          </div>
          <button className="p-3 bg-slate-700 text-white rounde-lg uppercase hover:opacity-95 disabled:opacity-80">
            Create listing
          </button>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listign image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  type="button"
                  className="text-red-700 p-3 rounded-lg uppercase hover:opacity-60"
                >
                  Delete
                </button>
              </div>
            ))}
        </div>
      </form>
    </main>
  );
}
