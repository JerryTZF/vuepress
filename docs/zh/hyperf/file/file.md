---
sidebar: 'auto'
prev: /zh/hyperf/hyperf-component.md

---

# 文件系统

::: tip
阿里云OSS适配器，这里使用的是 `Flysystem v2.0` 版本
:::

---

```php
    // 演示文件系统(阿里云OSS)
    #[PostMapping(path: "oss")]
    public function file(FilesystemFactory $factory): array|ResponseInterface
    {
        // 获取阿里云OSS适配器
        $ossInstance = $factory->get('oss');
        $action = $this->request->input('action', 'get');

        DemoValidator::ossValidator(['action' => $action]);

        if ($action === 'get') {
            $fileName = $this->request->input('file_name');
            if (null === $fileName) {
                [$e, $m] = [ErrorCode::FILE_NAME_ERR, ErrorCode::getMessage(ErrorCode::FILE_NAME_ERR)];
                return $this->result->setErrorInfo($e, $m)->getResult();
            }
            $remotePath = DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . $fileName;
            // 下载到本地
            $localPath = BASE_PATH . DIRECTORY_SEPARATOR . 'runtime' . DIRECTORY_SEPARATOR . $fileName;
            file_put_contents($localPath, $ossInstance->read($remotePath));

            return $this->response->download($localPath);
        }

        if ($action === 'upload') {
            $file = $this->request->file('upload');
            [$isMimeRight, $isExtensionRight] = [
                in_array($file->getMimeType(), ['image/heic', 'image/png', 'image/jpeg']),
                in_array($file->getExtension(), ['png', 'jpg', 'jpeg', 'heic', 'PNG', 'JPG', 'JPEG', 'HEIC'])
            ];
            if (!$isMimeRight || !$isExtensionRight) {
                [$e, $m] = [ErrorCode::FILE_MIME_ERR, ErrorCode::getMessage(ErrorCode::FILE_MIME_ERR)];
                return $this->result->setErrorInfo($e, $m)->getResult();
            }

            // 写入OSS
            $fileName = 'UPLOADER_' . date('YmdHis') . '.' . $file->getExtension();
            $remotePath = DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . $fileName;
            [$endpoint, $bucket] = [env('OSS_ENDPOINT'), env('OSS_BUCKET')];
            $address = "https://$bucket.$endpoint/img/" . $fileName;
            $ossInstance->write($remotePath, file_get_contents($file->getRealPath()));
            return $this->result->setData(['address' => $address])->getResult();
        }

        return $this->result->getResult();
    }
```