import { LightningElement, api, wire, track } from 'lwc';
import getInternsForCertification from '@salesforce/apex/CertificationAssignmentController.getInternsForCertification';
import deleteInternAssignment from '@salesforce/apex/CertificationAssignmentController.deleteInternAssignment';  // Make sure this is correct
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Intern Name', fieldName: 'internName' },
    { label: 'Assignment Date', fieldName: 'Assignment_Date__c', type: 'date' },
    { type: 'action', typeAttributes: { rowActions: [{ label: 'Delete', name: 'delete' }] } }
];

export default class PassedInterns extends LightningElement {
    @api recordId;
    @track interns = [];
    @track error;
    columns = COLUMNS;

    @wire(getInternsForCertification, { certificationId: '$recordId' })
    wiredInterns({ error, data }) {
        if (data) {
            this.interns = data.map(rec => ({
                id: rec.Id,
                internId: rec.Intern__c,
                internName: rec.Intern__r ? rec.Intern__r.Name : 'N/A',
                Assignment_Date__c: rec.Assignment_Date__c
            }));
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.interns = undefined;
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const rowId = event.detail.row.id;
        if (actionName === 'delete') {
            this.deleteIntern(rowId);
        }
    }

    deleteIntern(assignmentId) {
        deleteInternAssignment({ assignmentId })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Intern assignment deleted successfully',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredInterns);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Error deleting intern: ' + error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}