import { LightningElement, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import getObjectNames from '@salesforce/apex/DynamicLwcTask5.getObjectNames';
import getObjectFields from '@salesforce/apex/DynamicLwcTask5.getObjectFields';
import executeQueryApex from '@salesforce/apex/DynamicLwcTask5.executeQueryApex';
export default class DynamicLwcTask6 extends LightningElement {
    @track objectOptions = [];
    @track fieldOptions = [];
    @track selectedObject;
    @track selectedFields = [];
    @track filterConditions = [];
    @track operators = [];
    @track queryResult;
    @track columns;
    @track nooffilters=[0];
    condition={};
    
    selectedFieldsOnchange;
    fieldMaps = new Map();
    @wire(getObjectInfo, { objectApiName: '$selectedObject' })
    objectInfo;
    connectedCallback() {
        this.loadObjectNames();
    }
    loadObjectNames() {
        getObjectNames()
            .then((result) => {
                this.objectOptions = result.map((objName) => ({
                    label: objName,
                    value: objName
                }));
            })
            .catch((error) => {
                // Handle error
            });
    }
    handleObjectChange(event) {
        this.selectedObject = event.target.value;
        console.log('selected object::: ', this.selectedObject)
        this.selectedFields = [];
        this.fieldOptions = [];
        this.filterConditions = [];
        this.columns = null;
        this.operators = [];
        this.getFieldsForSelectedObject();
    }
    getFieldsForSelectedObject() {
        getObjectFields({ objectName: this.selectedObject })
            .then((result) => {
                console.log('result---', result);
                console.log('this.fieldMaps---', this.fieldMaps);
                const map1 = new Map(Object.entries(result));
                this.fieldMaps = map1;
                try {
                    let arr = [];
                    for (let key of map1.keys()) {
                        console.log('key1--', key);
                        arr.push({ label: key, value: key });
                    }
                    this.fieldOptions = arr;
                } catch (e) {
                    console.log('e2 ===> 58', e.message);
                }
                //this.getOperators();
            })
            .catch((error) => {
                console.log('e2 ===> 64', error.message);
            });
    }
    handleFieldChange(event) {
        this.selectedFields = event.target.value;
        //this.getOperators();
    }
    getOperators() {
        if (this.objectInfo.data) {
            const fields = this.objectInfo.data.fields;
            this.fieldOptions = Object.keys(fields)
                .filter((field) => this.selectedFields.includes(field))
                .map((field) => ({
                    label: fields[field].label,
                    value: field
                }));
        }
    }
    handleAddCondition() {
        try {
            this.filterConditions.push({
                id: Date.now(),
                field: '',
                operator: '',
                value: ''
            });
            
        } catch (error) {
            console.log('error at handleAddCondition-->',error.message);
        }
       
    }
    handleFieldSelection(event) {
        try {
            
            const conditionId = event.target.dataset.id;
            const selectedField = event.target.value;
            this.selectedFieldsOnchange = selectedField;
            console.log('selected fielsd.',selectedField);
            console.log('daatatype---> 94', this.fieldMaps.get(selectedField));
            let arr = [];
            let fieldType = this.fieldMaps.get(selectedField).toLowerCase();
            console.log('fieldType::: > 97', fieldType);
            
                if (fieldType == 'id' || fieldType == 'boolean') {
                    //operators = new List<String>{ '=', '!=' };
                    arr.push({ label: '=', value: '=' });
                    arr.push({ label: '!=', value: '!=' });
                }
                else if (fieldType == 'date' || fieldType == 'datetime' || fieldType == 'integer' || fieldType == 'double' || fieldType == 'long' || fieldType == 'decimal') {
                    arr.push({ label: '=', value: '=' });
                    arr.push({ label: '!=', value: '!=' });
                    arr.push({ label: '>', value: '>' });
                    arr.push({ label: '<', value: '<' });
                    arr.push({ label: '>=', value: '>=' });
                    arr.push({ label: '<=', value: '<=' });
                }
                else if (fieldType == 'string') {
                    arr.push({ label: '=', value: '=' });
                    arr.push({ label: '!=', value: '!=' });
                    arr.push({ label: 'LIKE', value: 'LIKE' });
                    arr.push({ label: 'NOT LIKE', value: 'NOT LIKE' });
                }
            
        
        
            console.log('arr::: 121', arr[0]);
            this.operators = arr;
            console.log('this.operators::: 123', this.operators)
            this.filterConditions = this.filterConditions.map((condition) => {
                
                if (condition.id === conditionId) {
                    condition.field = selectedField;
                    condition.operators = arr;
                    condition.operator = arr.length > 0 ? arr[0].key : '';
                    condition.value = '';
                }
                console.log('filter132-->',this.filterConditions [0]);
                return condition;
                console.log('filter134-->',this.filterConditions [0]);
            this.getOperatorsForCondition(conditionId);
            });
        } catch (error) {
            console.log('error 138 =====>',error.message);
        }

        
    }
    
    handleOperatorSelection(event) {
        try{
            const conditionId = event.target.dataset.id;
            const selectedOperator = event.target.value;
            this.selectedoperatortype = selectedOperator 
            console.log('selectedOperator',selectedOperator);
            this.filterConditions = this.filterConditions.map((condition) => {
                if (condition.id === conditionId) {
                    console.log('inside conditionID');
                    condition.operator = selectedOperator;
                }
                console.log('filter151-->',this.filterConditions [1]);
                return condition;
            });
        }catch (error) {
            console.log('error 155 =====>',error.message);
        }
        console.log('filter157-->',this.filterConditions [1]);
    }
    selectedvaluefromhandleChange
    passToApex
    handleValueSelection(event) {
        try{
            const conditionId = event.target.dataset.id;
            const selectedValue = event.target.value;
            this.selectedvaluefromhandleChange = selectedValue;
            this.passToApex =  `${this.selectedFieldsOnchange} ${this.selectedoperatortype}  '${selectedValue}'`

            console.log(' cthis.passToApex harsh 174---->', this.passToApex);
            console.log(' selectedValue Harsh 174---->', selectedValue);
            console.log('condition harshal '+ condition.id);
            
            this.filterConditions = this.filterConditions.map((condition) => {
                condition.value = selectedValue;
                console.log('condition harshal '+ conditio.value);
                if (condition.id === conditionId) {
                    condition.value = selectedValue;
                }
                console.log(' this.filterConditions 167---->', condition.value);
                console.log(' this.filterConditions 168---->', this.filterConditions);
                console.log(' selectedValue 169---->', selectedValue);
                console.log('condion :::::: 170',condition);
                return condition;
    
            });
            console.log(' this.filterConditions 174---->', condition.value);
                console.log(' this.filterConditions 175---->', this.filterConditions);
                console.log(' selectedValue 176---->', selectedValue);
                console.log('condion :::::: 177',condition);
            console.log('filter 175-->',this.filterConditions [2]);

        }catch (error) {
            console.log('error 181 =====>',error.message);
        }
    }
    
    // handleDeleteButton(event) {
    //     const conditionId = event.target.dataset.id;
    //     this.filterConditions = this.filterConditions.filter(
    //         (condition) => condition.id !== conditionId
    //     );
    // }
  
    executeQuery() {
        try {
            const selectedFields = this.selectedFields.join(', ');
            console.log('filter123-->',JSON.stringify(this.filterConditions [0]));
            console.log('filter124-->',this.filterConditions [1]);
            console.log('filter125-->',this.filterConditions [2]);
        const filterConditions = this.filterConditions
            .map((condition) => {
                const fieldApiName = condition.field;
                const operator = condition.operator;
                const value = condition.value;
                return `${fieldApiName} ${operator} '${value}'`;
            })
            .join(' AND ');
        executeQueryApex({ objectName: this.selectedObject, fieldNames: selectedFields, filterConditions: this.passToApex})
            .then((result) => {
                this.queryResult = result;
                this.columns = Object.keys(result[0]).map((fieldName) => ({
                    label: fieldName,
                    fieldName: fieldName,
                    type: 'text'
                }));
            })
                .catch((error) => {
                    // Handle error
                });
                
            } catch (error) {
                console.log('checking error at execute-----248>',error.message);
            }
        
        }
    
        addFilter(){
            try {
            this.nooffilters.push(this.nooffilters.length);
            console.log('this.nooffilters--',JSON.stringify(this.nooffilters));
            //this.filter=this.filter+
            } catch (error) {
                console.log('error---> addFilter',error.message);
            }
            
        }
        deleteFilter(event){
            try {
                console.log(event.currentTarget.dataset.id);
                this.nooffilters.splice(event.currentTarget.dataset.id, 1);
                        console.log('this.nooffilters--',JSON.stringify(this.nooffilters));
            } catch (error) {
                
                console.log('error---> deleteFilter(event)',error.message);
            }
        
        
        }
        @track selectedOperator;
        @track statement1;
        @track statement2;
        @track result;
    
        operators = [
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' },
        ];
    
        handleOperatorChange(event) {
            this.selectedOperator = event.target.value;
        }
    
        handleStatement1Change(event) {
            this.statement1 = event.target.value;
        }
    
        handleStatement2Change(event) {
            this.statement2 = event.target.value;
        }
    
        evaluateStatements() {
            for (const statement1Result = Boolean(eval(this.statement1); statement1Result < 5 ; statement1Result++) {
                if (this.selectedOperator === 'AND') {
                    this.result = statement1Result && statement2Result;
                } else if (this.selectedOperator === 'OR') {
                    this.result = statement1Result || statement2Result;
                }
            }
            // const statement1Result = Boolean(eval(this.statement1));
            // const statement2Result = Boolean(eval(this.statement2));
    
           
        
}
}
    

