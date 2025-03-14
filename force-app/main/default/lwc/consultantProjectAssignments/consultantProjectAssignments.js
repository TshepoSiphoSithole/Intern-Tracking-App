import { LightningElement, api, wire } from 'lwc';
import getAssignedProjects from '@salesforce/apex/ConsultantProjectAssignmentController.getAssignedProjects';
import assignConsultantToProject from '@salesforce/apex/ConsultantProjectAssignmentController.assignConsultantToProject';
import deleteProjectAssignment from '@salesforce/apex/ConsultantProjectAssignmentController.deleteProjectAssignment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

const COLUMNS = [
    { label: 'Project Name', fieldName: 'Name' },
    { label: 'Start Date', fieldName: 'Start_Date__c', type: 'date' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Client', fieldName: 'ClientName' },
    { type: 'action', typeAttributes: { rowActions: [{ label: 'Delete', name: 'delete' }] } }
];

export default class ConsultantProjectAssignments extends NavigationMixin(LightningElement) {
    @api recordId; // Consultant Profile ID
    columns = COLUMNS;
    projects = [];

    @wire(getAssignedProjects, { consultantId: '$recordId' })
    wiredProjects({ error, data }) {
        if (data) {
            this.projects = data.map(project => ({
                ...project,
                ClientName: project.Client__r ? project.Client__r.Name : 'N/A'
            }));
        } else {
            this.projects = [];
            console.error('Error fetching projects:', error);
        }
    }

    handleAssignProject() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Project_Assignment__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: `Assigned_Consultant__c=${this.recordId}`
            }
        });
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'delete') {
            this.deleteAssignment(row.Id);
        }
    }

    deleteAssignment(assignmentId) {
        deleteProjectAssignment({ assignmentId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Project assignment deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredProjects);
            })
            .catch(error => {
                console.error('Error deleting assignment:', error);
            });
    }
}
