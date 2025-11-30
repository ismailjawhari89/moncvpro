export const uploadFile = (req, res) => {
    if (req.file) {
        res.json({
            msg: 'File Uploaded!',
            file: `uploads/${req.file.filename}`,
        });
    } else {
        res.status(400).json({ msg: 'No file uploaded' });
    }
};
