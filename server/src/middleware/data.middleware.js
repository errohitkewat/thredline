
export const parseDataIntoJson = (req, res, next) => { 
    req.body?.price && (req.body.price = JSON.parse(req.body.price))
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes))

    if (req.body?.existingImageIds) {
        req.body.existingImageIds = JSON.parse(
            req.body.existingImageIds
        );
    }

    next();
}