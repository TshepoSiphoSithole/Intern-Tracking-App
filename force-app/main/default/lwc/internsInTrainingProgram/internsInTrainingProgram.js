import { LightningElement, api, wire, track } from 'lwc';
import getInternsByTrainingProgram from '@salesforce/apex/TrainingProgramController.getInternsByTrainingProgram';
import deleteIntern from '@salesforce/apex/TrainingProgramController.deleteIntern';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const COLUMNS = [
    { label: 'First Name', fieldName: 'FirstName' },
    { label: 'Last Name', fieldName: 'LastName' },
    { label: 'Email', fieldName: 'Email__c' },
    { 
        type: 'action', 
        typeAttributes: { 
            rowActions: [
                { label: 'Delete', name: 'delete', iconName: 'utility:delete', destructive: true }
            ]
        } 
    }
];

export default class InternsInTrainingProgram extends LightningElement {
    @api recordId;
    @track interns;
    @track error;
    wiredInternsResult;

    columns = COLUMNS;

    @wire(getInternsByTrainingProgram, { trainingProgramId: '$recordId' })
    wiredInterns(result) {
        this.wiredInternsResult = result;
        if (result.data) {
            this.interns = result.data.map(intern => ({
                ...intern,
                FirstName: intern.Intern_User__r ? intern.Intern_User__r.FirstName : 'N/A',
                LastName: intern.Intern_User__r ? intern.Intern_User__r.LastName : 'N/A'
            }));
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.interns = undefined;
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const internId = event.detail.row.Id;

        if (actionName === 'delete') {
            this.deleteInternRecord(internId);
        }
    }

    deleteInternRecord(internId) {
        deleteIntern({ internId })
            .then(() => {
                this.showToast('Success', 'Intern deleted successfully', 'success');
                return refreshApex(this.wiredInternsResult);
            })
            .catch(error => {
                this.showToast('Error', error.body.message, 'error');
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        }));
    }
}