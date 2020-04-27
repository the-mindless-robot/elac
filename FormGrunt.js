class FormGrunt {
    // remove special chars/spaces
    static cleanLabel(label) {
        let cleanLabel = label.replace('/', '-');
        cleanLabel = cleanLabel.split(' ').join('_');
        return cleanLabel;
    }
    
    // get input from text field by element id
    static getTextInputValue(id) {
        return document.getElementById(id).value;
    }
    // get selected values from select/options input by element id
    static getSelectInputValues(id, hasPlaceholder=true) {
        const values = {
            toString: '',
            toArray: [],
            obj: {},
            hasValues: false
        };

        const input = document.getElementById(id);
        const options = input.options;
        // console.log(options);
        const start = hasPlaceholder ? 1 : 0;
        let selected = 0;

        for (let i=start; i<options.length; i++) {
            // console.log(options[i]);
            if (options[i].selected === true) {
                // array
                values.toArray.push(options[i].value);
                //obj
                values.obj[FormGrunt.cleanLabel(options[i].value)] = true;
                //string
                if (selected !== 0) {
                    values.toString += ', '+options[i].value;
                } else {
                    values.toString += options[i].value;
                }
                selected++;
            } else {
                values.obj[FormGrunt.cleanLabel(options[i].value)] = false;
            }
           
        }
        if(selected > 0) {
            values.hasValues = true;
        }
        return values;
    }
    // get value from radio buttons/checkbox by field name
    static getSelectedRadioValue(name) {
        const options = document.getElementsByName(name);
        let value = null;
        let label = null;
        for(let i=0;i < options.length; i++) {
            if(options[i].checked) {
                value = options[i].value;
                label = options[i].nextElementSibling.innerText;
            }
        }
        return {label, value};
    }
    // checkbox query
    static isChecked(id) {
        const element = document.getElementById(id);
        return element.checked;
    }


}

