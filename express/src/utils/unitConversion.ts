import { TypeEnum } from "../enums/type";

const distanceConversions: { [key: string]: number } = {
    meter: 1,
    centimeter: 100,
    inch: 39.3701,
    feet: 3.28084,
    yard: 1.09361,
};

const temperatureConversions = {
    toCelsius: (value: number, fromUnit: string): number => {
        if (fromUnit === 'F') return (value - 32) * (5 / 9);
        if (fromUnit === 'K') return value - 273.15;
        return value;
    },
    fromCelsius: (value: number, toUnit: string): number => {
        if (toUnit === 'F') return value * (9 / 5) + 32;
        if (toUnit === 'K') return value + 273.15;
        return value;
    },
};

export const convertUnit = (type: string, fromUnit: string, toUnit: string, value: number): number => {
    if (type === TypeEnum.DISTANCE) {
        const fromFactor = distanceConversions[fromUnit.toLowerCase()];
        const toFactor = distanceConversions[toUnit.toLowerCase()];
        if (!fromFactor || !toFactor) throw new Error('Invalid distance unit');
        return (value / fromFactor) * toFactor;
    }

    if (type === TypeEnum.TEMPERATURE) {
        const valueInCelsius = temperatureConversions.toCelsius(value, fromUnit);
        return temperatureConversions.fromCelsius(valueInCelsius, toUnit);
    }

    throw new Error('Unsupported type for conversion');
};
