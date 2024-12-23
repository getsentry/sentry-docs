'use client';

export async function uploadImage(file: File) {
  const result = await fetch(`/changelog/_admin/upload?file=${file.name}`);
  const {response, options} = await result.json();
  const {url, fields} = response;
  const formData = new FormData();
  Object.entries({...fields, file}).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });

  await fetch(url, {
    method: 'POST',
    body: formData,
  });
  return {
    url: `${url}${encodeURIComponent(options.destination)}`,
    originalFilename: file.name,
  };
}
