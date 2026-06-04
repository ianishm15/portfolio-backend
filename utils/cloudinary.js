import fs from "fs";

import {
  v2 as cloudinary,
} from "cloudinary";

/* ---------------------------- */
/* Upload File                  */
/* ---------------------------- */

export const uploadToCloudinary =
  async (

    file,

    folder = "portfolio"

  ) => {

    const result =
      await cloudinary.uploader.upload(

        file,

        {

          folder,

        }

      );

    /* ------------------------ */
    /* Remove Local File        */
    /* ------------------------ */

    fs.unlinkSync(file);

    return {

      public_id:
        result.public_id,

      url:
        result.secure_url,

    };

  };

/* ---------------------------- */
/* Delete File                  */
/* ---------------------------- */

export const deleteFromCloudinary =
  async (public_id) => {

    if (!public_id)
      return;

    await cloudinary.uploader.destroy(
      public_id
    );

  };