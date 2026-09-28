import { useEffect, useState } from "react";
import { SanatoriumPhoto } from "./types";
import { GetProp, Image, Upload, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { RcFile } from "antd/es/upload";

interface GalleryProps {
  photos: SanatoriumPhoto[];
  onDeletePhoto: (id: number) => void;
  onUploadPhoto: (photo: File) => void;
}
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function Gallery({ photos, onUploadPhoto, onDeletePhoto }: GalleryProps): React.JSX.Element {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const [fileList, setFileList] = useState<UploadFile[]>(() =>
    photos.map((photo) => ({
      uid: photo.id.toString(),
      name: `image_${photo.id}`,
      url: photo.thumb_file,
      preview: photo.photo_file,
      status: 'done',
    }))
  );

  useEffect(() => {
    setFileList(
      photos.map((photo) => ({
        uid: photo.id.toString(),
        name: `image_${photo.id}`,
        url: photo.thumb_file,
        preview: photo.photo_file,
        status: 'done',
      }))
    );
  }, [photos]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.preview || file.url as string);
    setPreviewOpen(true);
  };

  const handleBeforeUpload = (file: RcFile) => {
    onUploadPhoto(file);
    return false;
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Загрузить</div>
    </button>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        beforeUpload={handleBeforeUpload}
        onRemove={(file) => {
          onDeletePhoto(Number(file.uid));
        }}
      >
        {uploadButton}
      </Upload>
      {previewImage && (
        <Image
          styles={{ root: { display: 'none' } }}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
            afterOpenChange: (open) => !open && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}
