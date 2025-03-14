import { LightningElement, wire, track } from 'lwc';
import getTotalInterns from '@salesforce/apex/InternTrackingDashboardController.getTotalInterns';
import getInternsPerProgram from '@salesforce/apex/InternTrackingDashboardController.getInternsPerProgram';
import getConsultantsPerProject from '@salesforce/apex/InternTrackingDashboardController.getConsultantsPerProject';

export default class InternTrackingDashboard extends LightningElement {
    @track totalInterns = 0;
    @track internsPerProgram = [];
    @track consultantsPerProject = [];

    @wire(getTotalInterns)
    wiredTotalInterns({ error, data }) {
        if (data) {
            this.totalInterns = data;
        } else if (error) {
            console.error('Error fetching total interns:', error);
        }
    }

    @wire(getInternsPerProgram)
    wiredInternsPerProgram({ error, data }) {
        if (data) {
            this.internsPerProgram = data.map(record => ({
                Training_Programs__c: record.Training_Programs__c,
                totalInterns: record.totalInterns
            }));
        } else if (error) {
            console.error('Error fetching interns per program:', error);
        }
    }

    @wire(getConsultantsPerProject)
    wiredConsultantsPerProject({ error, data }) {
        if (data) {
            this.consultantsPerProject = data.map(record => ({
                Project__c: record.Project__c,
                totalConsultants: record.totalConsultants
            }));
        } else if (error) {
            console.error('Error fetching consultants per project:', error);
        }
    }
}