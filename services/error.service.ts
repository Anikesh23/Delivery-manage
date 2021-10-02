exports.returnError = (res: any, err: any) =>
    res.status(500).json({
        error: err
    });
