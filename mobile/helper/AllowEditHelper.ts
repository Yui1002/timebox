import { AllowEdit } from "../enums";

export const AllowEditHelper = {
    toString: (value: AllowEdit | number): string => {
        return value === 1 || value === AllowEdit.True ? 'Yes' : 'No';
    },

    toNumber: (value: string): AllowEdit => {
        return value === "Yes" ? AllowEdit.True : AllowEdit.False;
    },

    fromBoolean: (value: boolean): AllowEdit => {
        return value ? AllowEdit.True : AllowEdit.False;
    }
}