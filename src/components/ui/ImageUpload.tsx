import React, { useState, useRef, type ChangeEvent } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import styles from './ImageUpload.module.css';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, label }) => {
    const [preview, setPreview] = useState<string | undefined>(value);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                onChange(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    };

    const handleRemove = () => {
        setPreview(undefined);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}

            <div
                className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${preview ? styles.hasImage : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !preview && fileInputRef.current?.click()}
            >
                {preview ? (
                    <div className={styles.previewContainer}>
                        <img src={preview} alt="Preview" className={styles.preview} />
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <ImageIcon size={48} className={styles.icon} />
                        <p className={styles.text}>
                            <Upload size={20} className={styles.uploadIcon} />
                            Arraste uma imagem ou clique para selecionar
                        </p>
                        <span className={styles.hint}>PNG, JPG, GIF até 5MB</span>
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                />
            </div>
        </div>
    );
};
