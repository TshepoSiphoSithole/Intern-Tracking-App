import { LightningElement, api, wire, track } from 'lwc';
import getAssignedConsultants from '@salesforce/apex/ProjectConsultantController.getAssignedConsultants';
import deleteConsultantAssignment from '@salesforce/apex/ProjectConsultantController.deleteConsultantAssignment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'Consultant Name', fieldName: 'ConsultantName' },
    { type: 'action', typeAttributes: { rowActions: [{ label: 'Delete', name: 'delete' }] } }
];

export default class ProjectConsultantsList extends NavigationMixin(LightningElement) {
    @api recordId; // Project ID
    columns = COLUMNS;
    @track consultants = [];
    wiredResult;

    @wire(getAssignedConsultants, { projectId: '$recordId' })
    wiredConsultants(result) {
        this.wiredResult = result;
        if (result.data) {
            this.consultants = result.data.map(consultant => ({
                ...consultant,
                ConsultantName: consultant.Consultant_Profile__r && 
                               consultant.Consultant_Profile__r.Consultant__r
                    ? consultant.Consultant_Profile__r.Consultant__r.Name
                    : (consultant.consult__r ? consultant.consult__r.Name : 'Unknown Consultant')
            }));
        } else {
            this.consultants = [];
            console.error('Error fetching consultants:', result.error);
        }
    }

    handleAssignConsultant() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Consultant_Assignment__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: `Project__c=${this.recordId}`
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
        deleteConsultantAssignment({ assignmentId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Consultant assignment deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                console.error('Error deleting assignment:', error);
            });
    }
}
