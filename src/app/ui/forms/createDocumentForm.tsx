"use client"
import Cookies from 'js-cookie'
import { InboxOutlined } from "@ant-design/icons"
import { message, Upload } from "antd"
const { Dragger } = Upload
export function CreateDocumentForm() {
    return (<Dragger
        height={400}
        name="file"
        action={`${process.env.BACKEND_URI}/documents`}
        headers={{
            Authorization: `Bearer ${Cookies.get('token')}` || ""
        }}
        onChange={(info) => {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} файл успешно загружен.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} ошибка загрузки файла.`);
            }
        }}
    >
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
        </p>
    </Dragger>)
}