export const formatPrice = (value: number):string => {
    if (value >= 1000000) {
        const shillings = `UgX ${(value / 1000000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}M`;
        return shillings;
    }

    if (value >= 100000) {
        const shillings = `UgX ${(value / 1000).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}K`;
        return shillings;
    }
    return `UgX ${value.toLocaleString()}`;
}