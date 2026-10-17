export const rules = {
     description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
    category: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/
};

export function valid(record) {
    return rules.description.test(record.description) &&
    rules.amount.test(record.amount) &&
    rules.date.test(record.date) &&
    rules.category.test(record.category);
}

export const duplicateWords = /\b(\w+)\s+\1\b/i;
