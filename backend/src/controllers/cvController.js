export const saveCV = (req, res) => {
    const cvData = req.body;
    console.log('Received CV Data:', cvData);

    // Here you would typically save to database
    // const savedCV = await prisma.cv.create({ data: cvData });

    res.json({
        status: 'success',
        message: 'CV received successfully',
        data: cvData
    });
};
