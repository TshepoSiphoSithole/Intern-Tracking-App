import { LightningElement, api, wire } from 'lwc';
import getAssignedInterns from '@salesforce/apex/InternTrainingAssignmentController.getAssignedInterns';

const COLUMNS = [
    { label: 'Intern Name', fieldName: 'name' },
    { label: 'Assignment Date', fieldName: 'assignmentDate', type: 'date' }
];

export default class AssignedInternsInTrainingProgram extends LightningElement {
    @api recordId; // The Training Program record ID passed into the component
    interns = [];
    error;

    // Wire method to fetch assigned interns from the Apex controller
    @wire(getAssignedInterns, { trainingProgramId: '$recordId' })
    wiredInterns({ error, data }) {
        if (data) {
            // Flatten the list of interns to include only their Name and Assignment Date
            this.interns = data.map(intern => ({
                name: intern.Intern_Profile__r.Name,
                assignmentDate: intern.Assignment_Date__c
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.interns = [];
        }
    }
}