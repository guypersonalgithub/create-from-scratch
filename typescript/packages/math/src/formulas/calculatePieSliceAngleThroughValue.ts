type CalculatePieSliceAngleThroughValueArgs = {
    value: number;
    total: number;
}

export const calculatePieSliceAngleThroughValue = ({ value, total }: CalculatePieSliceAngleThroughValueArgs) => {
    return (value / total) * 2 * Math.PI;
}