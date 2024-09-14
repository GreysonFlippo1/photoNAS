
export function filterFiles(files, formats) {
    return files.filter(file => {
        return formats.includes(`${file.split('.').slice(-1)}`.toLowerCase())
    })
}