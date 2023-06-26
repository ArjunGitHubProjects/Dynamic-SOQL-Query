public with sharing class DynamicLwcTask5 {
    
    @AuraEnabled(cacheable=true)
    public static List<String> getObjectNames() {
        
        // Create an empty list to store ObjectNames
        
        List<String> objectNames = new List<String>();
        
        // Iterate through the Objects
        
        
        for (Schema.SObjectType objectType : Schema.getGlobalDescribe().values()) {
            
            objectNames.add(objectType.getDescribe().getName());
        }
        // Sort the ObjectNames
        
        objectNames.sort();
        return objectNames;
    }
    
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getObjectFields(String objectName) {
        
        // Create an empty map to store the FieldNames and their data types       
        Map<String, String> fieldMap = new Map<String, String>();
        // Get the describe result for the object      
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objectName).getDescribe();
        Map<String, Schema.SObjectField> fieldsMap = describeResult.fields.getMap();
        for (String fieldName : fieldsMap.keySet()) {
            Schema.DescribeFieldResult fieldDescribeResult = fieldsMap.get(fieldName).getDescribe();
            String fieldType = fieldDescribeResult.getType().name();
            fieldMap.put(fieldName, fieldType);
        }
        
        return fieldMap;
    }

    
    @AuraEnabled(cacheable=true)
    
    public static List<sObject> executeQueryApex(String objectName, String fieldNames, String filterConditions) {
        
        List<sObject> queryResult = new List<sObject>();
        
        System.debug('filterConditions--->'+filterConditions);
        
        String query = 'SELECT ' + fieldNames + ' FROM ' + objectName;
        
        System.debug('query::: ' + query);
        
        List<String> conditionList = new List<String>();
        
        List<String> bindVariables = new List<String>();
        
        if (!String.isBlank(filterConditions)) {
            
            String[] conditions = filterConditions.split(' AND ');
            
            for (String condition : conditions) {
                
                String[] parts = condition.split(' ');
                
                if (parts.size() == 3) {
                    
                    String fieldApiName = parts[0];
                    
                    String operator = parts[1];
                    
                    String value = parts[2];
                    
                    conditionList.add(fieldApiName + ' ' + operator + ' :' + fieldApiName);
                    
                    bindVariables.add(value);
                    
                }
                
            }
            
            //query += ' WHERE ' + String.join(conditionList, ' AND ');
            query += ' WHERE ' + filterConditions;
            
            System.debug('query condition::: ' + query);
            
        }
        
        
        
        try {
            
            if (!bindVariables.isEmpty()) {
                
                for(String bindVariable : bindVariables ){
                    
                    query = query.replaceFirst(':', ':'+ bindVariable + ' ' );
                    
                }
                
                // String dynamicQuery = query.replace(':', '');
                
                queryResult = Database.query(query);
                
            } else {
                
                queryResult = Database.query(query);
                
            }
            
        } catch (Exception e) {
            
            // Handle exception
            
        }
        
        System.debug('queryResult::: '+ queryResult);
        
        return queryResult;
        
    }
    
    
    
}