public with sharing class InternsInTrainingProgramController {
    @AuraEnabled(cacheable=true)
    public static List<Certification_Assignment__c> getInternAchievedCertificates(Id internId) {
        if (String.isEmpty(internId)) {
            return new List<Certification_Assignment__c>();
        }

        // Ensure the user has access to Certification_Assignment__c
        if (!Schema.sObjectType.Certification_Assignment__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view Certification Assignments.');
        }

        try {
            // Query the Certification Assignment object, using the Intern__c and Certification__r relationship
            List<Certification_Assignment__c> assignments = [
                SELECT Id, Certification__r.Name, Assignment_Date__c 
                FROM Certification_Assignment__c 
                WHERE Intern__c = :internId
            ];
            
            // Ensure that certifications are returned
            if (assignments.isEmpty()) {
                return new List<Certification_Assignment__c>();
            }

            return assignments;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching achieved certifications: ' + e.getMessage());
        }
    }
}
