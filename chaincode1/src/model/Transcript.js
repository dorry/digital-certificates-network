'use strict';

export default class Transcript{

    constructor(name,gpa,grade){
        this.name = name; 
        this.gpa = gpa;
        this.grade = grade;
        }

    get name(){
        return this.name;
    }
    get gpa(){
        return this.gpa;
    }

    get grade(){
        return this.grade;
    }
        


}