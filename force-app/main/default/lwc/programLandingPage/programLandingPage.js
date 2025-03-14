import { LightningElement, track, wire } from 'lwc';
import getTrainingPrograms from '@salesforce/apex/TrainingProgramControllers.getTrainingPrograms';
import createTrainingProgram from '@salesforce/apex/TrainingProgramControllers.createTrainingProgram';
import createIntern from '@salesforce/apex/TrainingProgramControllers.createIntern';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ProgramLandingPage extends LightningElement {
    @track trainingPrograms = [];
    @track programOptions = [];
    programName = '';
    startDate = '';
    completionDate = '';
    selectedProgramId = '';
    internName = '';
    internEmail = '';

    // Fetch Training Programs when component loads
    @wire(getTrainingPrograms)
    wiredPrograms({ error, data }) {
        if (data) {
            this.trainingPrograms = data;
            this.programOptions = data.map(program => ({
                label: program.Name,
                value: program.Id
            }));
        } else if (error) {
            console.error('Error fetching training programs', error);
        }
    }

    // Handle program form inputs
    handleProgramChange(event) { this.programName = event.target.value; }
    handleStartDateChange(event) { this.startDate = event.target.value; }
    handleCompletionDateChange(event) { this.completionDate = event.target.value; }

    // Create a new Training Program
    createProgram() {
        if (this.programName && this.startDate && this.completionDate) {
            createTrainingProgram({ programName: this.programName, startDate: this.startDate, completionDate: this.completionDate })
                .then(result => {
                    this.trainingPrograms.push(result);
                    this.programOptions.push({ label: result.Name, value: result.Id });
                    this.showToast('Success', 'Training Program created!', 'success');
                })
                .catch(error => {
                    console.error('Error creating program', error);
                    this.showToast('Error', 'Failed to create Training Program.', 'error');
                });
        } else {
            this.showToast('Error', 'Fill all fields before creating a program.', 'error');
        }
    }

    // Handle intern form inputs
    handleProgramSelection(event) { this.selectedProgramId = event.target.value; }
    handleInternChange(event) { this.internName = event.target.value; }
    handleInternEmailChange(event) { this.internEmail = event.target.value; }

    // Create Intern and assign to a Training Program
    createIntern() {
        if (this.internName && this.internEmail && this.selectedProgramId) {
            createIntern({ internName: this.internName, email: this.internEmail, programId: this.selectedProgramId })
                .then(() => {
                    this.showToast('Success', 'Intern created and assigned!', 'success');
                })
                .catch(error => {
                    console.error('Error creating intern', error);
                    this.showToast('Error', 'Failed to create intern.', 'error');
                });
        } else {
            this.showToast('Error', 'Fill all fields before creating an intern.', 'error');
        }
    }

    // Show Toast Message
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}