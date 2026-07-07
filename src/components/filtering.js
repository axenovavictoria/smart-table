import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].append(
            ...Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            })
        );
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const parent = action.parentElement;
            const input = parent.querySelector('input, select');
            if (input) {
                input.value = '';
                state[action.dataset.field] = '';
            }
        }

        const totalFrom = state.totalFrom ? parseFloat(state.totalFrom) : null;
        const totalTo = state.totalTo ? parseFloat(state.totalTo) : null;

        // Сначала фильтруем по диапазону сумм (числовое сравнение)
        let filteredData = data;
        
        if (totalFrom !== null || totalTo !== null) {
            filteredData = data.filter(row => {
                const total = parseFloat(row.total);
                if (isNaN(total)) return false;
                
                if (totalFrom !== null && total < totalFrom) return false;
                if (totalTo !== null && total > totalTo) return false;
                
                return true;
            });
        }

        // Затем применяем остальные фильтры (текстовые)
        const stateWithoutRange = {
            ...state,
            totalFrom: '',
            totalTo: ''
        };

        // @todo: #4.3 — настроить компаратор
        const compare = createComparison(defaultRules);

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return filteredData.filter(row => compare(row, stateWithoutRange));
    }
}