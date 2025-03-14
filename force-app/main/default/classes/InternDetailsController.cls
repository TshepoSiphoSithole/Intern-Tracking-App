public with sharing class InternDetailsController {
    @AuraEnabled(cacheable=true)
    public static List<Intern__c> getAssignedInterns() {
        // ✅ Security Check to prevent unauthorized access
        if (!Schema.sObjectType.Intern__c.isAccessible() || 
            !Schema.sObjectType.Intern__c.fields.Name.isAccessible()) {
            throw new SecurityException('Access denied: You do not have permission to view Intern details.');
        }

        // ✅ Fetch Intern Name (Lookup Relationship)
        return [SELECT Id, Name FROM Intern__c];
    }
}

