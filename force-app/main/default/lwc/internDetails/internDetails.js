import { LightningElement, wire } from 'lwc';
import getAssignedInterns from '@salesforce/apex/InternDetailsController.getAssignedInterns';

export default class InternDetails extends LightningElement {
    assignedInterns = [];

    @wire(getAssignedInterns)
    wiredInterns({ error, data }) {
        if (data) {
            this.assignedInterns = data;
        } else if (error) {
            console.error('Error fetching interns:', error);
        }
    }
}