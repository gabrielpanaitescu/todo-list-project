const createTextElem = (type, text, parent) => {
    const elem = document.createElement(type);
    elem.textContent = text;
    if (parent) parent.appendChild(elem);
    return elem;
};

const createDivContainer = (className, idName, parent) => {
    const divContainer = document.createElement('div');
    if (idName) divContainer.id = idName;
    if (className) divContainer.classList.add(className);
    if  (parent) parent.appendChild(divContainer);
    return divContainer;
};

const createButton = (text, className, idName, parent) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    if (className) btn.classList.add(className);
    if (idName) btn.id = idName;
    if (parent) parent.appendChild(btn);
    return btn;
};

const createLabel = (htmlFor, text, parentForm) => {
    const label = document.createElement('label');
    if (htmlFor) label.htmlFor = htmlFor;
    if (text) label.textContent = text;
    parentForm.appendChild(label);
    return label;
};

const createInput = (type, name, id, required, minLength, parentForm) => {
    const input = document.createElement('input');
    if (type) input.type = type;
    if (name) input.name = name;
    if (id) input.id = id;
    if (required) input.required = required;
    if (minLength) input.minLength = minLength;
    if (parentForm) parentForm.appendChild(input);
    return input;
};

const createImportanceSelectElem = (taskType, parent) => {
    const select = document.createElement('select');
    select.id = taskType + 'Importance';
    select.name = taskType + 'Importance';
    const option1 = document.createElement('option');
    const option2 = document.createElement('option');
    option1.value = 'Low';
    option2.value = 'High';
    option1.textContent = 'Low';
    option2.textContent = 'High';
    select.appendChild(option1);
    select.appendChild(option2);
    if (parent) parent.appendChild(select);
    return select;
};

const createMaterialIcon = (iconName, parent, insertBeforeFirstChild) => {
    const span = document.createElement('span');
    span.classList.add('material-icons');
    span.textContent = iconName;
    if (parent) {
        if (insertBeforeFirstChild) {
            parent.insertBefore(span, parent.firstChild);
            return;
        }
        parent.appendChild(span);
    } else {
        return span;
    }
};

const createAnicon = (iconName, parent) => {
    const span = document.createElement('span');
    span.classList.add('icon');
    span.textContent = iconName;
    if (parent) {
        parent.appendChild(span);
    } else {
        return span;
    }
};

export { createTextElem, createDivContainer, createButton, createLabel, createInput, createImportanceSelectElem, createMaterialIcon, createAnicon };