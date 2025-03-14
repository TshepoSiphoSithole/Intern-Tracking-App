public with sharing class AchievedCertificatesController {

    @AuraEnabled(cacheable=true)
    public static List<Certification_Assignment__c> getInternAchievedCertificates(Id internId) {
        // Check if the current user has access to the Certification Assignment object
        if (!Schema.sObjectType.Certification_Assignment__c.isAccessible()) {
            throw new AuraHandledException('You do not have permission to view Certification Assignments.');
        }

        try {
            // Only query if the user has read access to Certification_Assignment__c
            List<Certification_Assignment__c> certificates = [
                SELECT Id, Certification__r.Name, Assignment_Date__c
                FROM Certification_Assignment__c
                WHERE Intern__c = :internId
            ];
            return certificates;
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching certificates: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static void deleteCertificateAssignment(Id certificateAssignmentId) {
        // Check if the current user has delete access to Certification_Assignment__c
        if (!Schema.sObjectType.Certification_Assignment__c.isDeletable()) {
            throw new AuraHandledException('You do not have permission to delete Certification Assignments.');
        }

        try {
            Certification_Assignment__c assignmentToDelete = [
                SELECT Id FROM Certification_Assignment__c WHERE Id = :certificateAssignmentId LIMIT 1
            ];
            delete assignmentToDelete;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting certificate assignment: ' + e.getMessage());
        }
    }
}
