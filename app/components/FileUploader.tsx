"use client";
import { ChangeEvent, useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Img {
  src: string;
}

const FileUploader: React.FC<{}> = () => {
  const [img, setImg] = useState<Img | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        if (reader.result) {
          let currentProgress = 0;
          const interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);

            if (currentProgress === 100) {
              clearInterval(interval);
              setImg({ src: reader.result.toString() });
              setLoading(false);
              setIsImageUploaded(true);
            }
          }, 500);
        }
      };

      reader.onerror = () => {
        console.log(reader.error);
        setLoading(false);
      };
    }
  };

  const handleUploadAnother = () => {
    setImg(null);
    setIsImageUploaded(false);
    inputRef.current?.click();
  };

  useEffect(() => {
    setProgress(0);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-900">
      <div className="bg-zinc-800 rounded-xl p-8 w-full max-w-md text-center  border-2 border-primary">
        <h1 className="text-3xl font-bold mb-4 text-solid from-blue-500 to-blue-900 via-blue-700">Choose an Image</h1>
        
        <button
          className="btn btn-primary"
          onClick={() => inputRef.current?.click()}
        >
          {isImageUploaded ? 'Upload Another Image' : 'Upload Image'}
        </button>
        <input
          ref={inputRef}
          onChange={onChange}
          type="file"
          name="file"
          className="mb-4"
          style={{ display: 'none' }}
        />

        {loading && (
          <div className="mt-4">
            <div className="radial-progress bg-primary text-primary-content border-4 border-primary mx-auto" style={{ "--value": progress }} role="progressbar">
              {progress}%
            </div>
          </div>
        )}

        {img && !loading && (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Image chosen:</h2>
            <Image src={img.src} width={200} height={200} className="mb-4 mx-auto" />
          </div>
        )}

        {img && !loading && (
          <div className="mt-4">
            <h2 className="text-3xl font-bold mb-4">Result</h2>
            <p className="text-white">Your result text here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
