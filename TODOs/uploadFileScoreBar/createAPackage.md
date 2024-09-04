- Create a package with this reference:

type UploadFileArgs = {
    file: File;
}

export const uploadFile = ({ file }: UploadFileArgs) => {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Setup event listener for progress
    xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        console.log(Upload Progress: ${percentComplete.toFixed(2)}%);
      }
    };

    // Setup event listener for when the request is complete
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(Failed to upload: ${xhr.statusText}));
      }
    };

    // Setup event listener for errors
    xhr.onerror = () => reject(new Error('Upload failed due to a network error'));

    // Open the request and send the file
    xhr.open('POST', '/upload');
    xhr.setRequestHeader('Content-Type', 'multipart/form-data');
    xhr.send(file);
  });
}