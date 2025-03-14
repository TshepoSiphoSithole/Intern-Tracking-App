import { LightningElement, wire, track } from 'lwc';
import getTrainingPrograms from '@salesforce/apex/InternTrackingController.getTrainingPrograms';
import getGroupedCertifications from '@salesforce/apex/InternTrackingController.getGroupedCertifications';
import createTrainingProgram from '@salesforce/apex/InternTrackingController.createTrainingProgram';
import { NavigationMixin } from 'lightning/navigation';

export default class InternTrackingHome extends NavigationMixin(LightningElement) {
    @track trainingPrograms = [];
    @track groupedCertifications = {};
    @track showForm = false;
    @track successMessage = '';
    @track showPrograms = false;
    @track showCertificates = false;
    @track showNextButton = false;

    programName = '';
    startDate = '';

    @wire(getTrainingPrograms)
    wiredPrograms({ error, data }) {
        if (data) {
            this.trainingPrograms = Object.values(data);
        } else if (error) {
            console.error('Error fetching training programs:', error);
        }
    }

    @wire(getGroupedCertifications)
    wiredCertifications({ error, data }) {
        if (data) {
            this.groupedCertifications = data;
        } else if (error) {
            console.error('Error fetching grouped certifications:', error);
        }
    }

    handleCreateProgram() {
        this.showForm = true;
    }

    handleSubmit() {
        createTrainingProgram({ programName: this.programName, startDate: this.startDate })
            .then(result => {
                this.successMessage = result;
                this.showForm = false;
                this.showNextButton = true;
                this.programName = '';
                this.startDate = '';
            })
            .catch(error => {
                this.successMessage = 'Error creating program';
                console.error('Error:', error);
            });
    }

    handleChange(event) {
        const field = event.target.name;
        if (field === 'programName') {
            this.programName = event.target.value;
        } else if (field === 'startDate') {
            this.startDate = event.target.value;
        }
    }

    togglePrograms() {
        this.showPrograms = !this.showPrograms;
        this.showCertificates = false;
    }

    toggleCertificates() {
        this.showCertificates = !this.showCertificates;
        this.showPrograms = false;
    }

    handleNext() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Intern_Profile__c',
                actionName: 'new'
            }
        });
    }

    get formattedCertifications() {
        return Object.keys(this.groupedCertifications).map(cert => ({
            name: cert,
            interns: this.groupedCertifications[cert]
        }));
    }
}
