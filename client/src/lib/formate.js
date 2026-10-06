

export const formatPrice = (price) => {
    if (!price || typeof price.amount !== "number" || !price.currency) {
        return "";
    }

    return new Intl.NumberFormat(price?.currency === "INR" ? "en-IN" : "en-US",
    {
        style: "currency",
        currency: price.currency,
        maximumFractionDigits: 0,
    }).format(price.amount);
}
