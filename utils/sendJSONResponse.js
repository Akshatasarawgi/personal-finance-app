export function sendJSONResponse(res, statusCode, contentType, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', contentType);
    res.end(payload);
}

