import { Component, OnInit, Input } from '@angular/core';
import { BackendService } from 'src/app/services/backend.service';
import { StateService } from 'src/app/services/state.service';
import { ThemePalette } from '@angular/material/core';
import * as dayjs from 'dayjs';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  checkedarray: any = [];
  objAnswer: any = [];
  checkboxcolor: ThemePalette = 'primary';
  isDisabled: boolean = false;
  next: number = 0;
  isProgressed: boolean = false;
  isCompletedAssessment2: boolean = false;
  arrAssessmentResult: any = [];
  error_count: number = 0;
  result: string = '';
  checkbox: any = [];
  @Input() arrAssessmentType2: any = [];
  @Input() arrKeyObj: any = {};
  constructor(
    private backendService: BackendService,
    public stateService: StateService
  ) {}

  qn: number = 0;
  on: number = 0;
  arr: any = [];

  select_option(
    option_id_selected: string,
    option_text: string,
    type: string,
    test_category: string
  ) {
    console.log(option_id_selected);
    if (test_category == 'assimilation') {
      if (type == 'mc') {
        if (option_id_selected == 'D' && option_text == 'All of the above') {
          let i = this.objAnswer.findIndex((p: any) => p.option_id == 'D');
          if (i == -1) {
            this.checkedarray = ['0', '1', '2', '3'];
            this.isDisabled = true;
            this.objAnswer = [];
            this.next = 0;
            let ans = {
              ser: this.next++,
              option_id: option_id_selected,
              option_text: option_text,
            };
            this.objAnswer.push(ans);
          } else {
            this.checkedarray = ['', '', '', ''];
            this.isDisabled = false;
            this.objAnswer = [];
            this.next = 0;
          }
          console.log(this.objAnswer);
        } else if (
          option_id_selected == 'D' &&
          option_text == 'None of the above'
        ) {
          let i = this.objAnswer.findIndex((p: any) => p.option_id == 'D');
          if (i == -1) {
            this.checkedarray = ['', '', '', '3'];
            this.isDisabled = true;
            this.objAnswer = [];
            this.next = 0;
            let ans = {
              ser: this.next++,
              option_id: option_id_selected,
              option_text: option_text,
            };
            this.objAnswer.push(ans);
          } else {
            this.checkedarray = ['', '', '', ''];
            this.isDisabled = false;
            this.objAnswer = [];
            this.next = 0;
          }
          console.log(this.objAnswer);
        } else {
          let k = this.objAnswer.findIndex(
            (p: any) => p.option_id == option_id_selected
          );
          if (k == -1) {
            let ans = {
              ser: this.next++,
              option_id: option_id_selected,
              option_text: option_text,
            };
            this.objAnswer.push(ans);
          } else {
            this.objAnswer.splice(k, 1);
          }
          console.log(this.objAnswer);
        }
      }
    }
  }

  on_option_select(ques: any, n: number, i: number) {
    console.log('NI', n + ' ' + i);
    if (this.objAnswer.length == 0) {
      let data = {
        id: n + '-' + i,
        option_id: ques.options[i].option_id,
        option_text: ques.options[i].option_text,
      };
      ques.options[i].is_selected = 1;
      this.objAnswer.push(data);
    } else {
      const num = n + '-' + i;
      let m = this.objAnswer.findIndex((p: any) => p.id == num);
      if (m == -1) {
        let data = {
          id: n + '-' + i,
          option_id: ques.options[i].option_id,
          option_text: ques.options[i].option_text,
        };
        ques.options[i].is_selected = 1;
        this.objAnswer.push(data);
      } else {
        ques.options[i].is_selected = 0;
        this.objAnswer.splice(m, 1);
      }
    }

    console.log(this.objAnswer);
  }

  submit_answer_for_module_assessment(ques: any) {
    // console.log(ques);
    if (this.objAnswer.length == 1) {
      if (this.objAnswer[0].option_text == 'All of the above') {
        this.result = ques.answer == 'AOA' ? 'Correct' : 'Wrong';
      } else if (this.objAnswer[0].option_text == 'None of the above') {
        this.result = ques.answer == 'NOA' ? 'Correct' : 'Wrong';
      } else {
        this.result =
          ques.answer == this.objAnswer[0].option_id ? 'Correct' : 'Wrong';
        console.log(this.result);
      }
      this.checkedarray = [];
      this.objAnswer = [];
      this.isDisabled = false;
      let data = {
        studend_id: 10001,
        course_id: ques.course_id,
        module_id: ques.module_id,
        question_id: ques.question_id,
        answer: ques.answer,
        result: this.result,
      };
      this.arrAssessmentResult.push(data);
      console.log('arrAssessmentResult :', this.arrAssessmentResult);
    } else {
      let ans_string = '';
      for (let i = 0; i < this.objAnswer.length; i++) {
        ans_string = ans_string + this.objAnswer[i].option_id;
      }
      console.log(ans_string);
      let str = ans_string.split('');
      let ans_string_reverse = str[1] + str[0];
      this.result =
        ques.answer === ans_string || ques.answer === ans_string_reverse
          ? 'Correct'
          : 'Wrong';

      this.objAnswer = [];
      this.checkedarray = [];
      let data = {
        studend_id: this.arrKeyObj.student_id,
        course_id: ques.course_id,
        module_id: ques.module_id,
        question_id: ques.question_id,
        answer: ques.answer,
        result: this.result,
      };
      this.arrAssessmentResult.push(data);
      console.log('arrAssessmentResult :', this.arrAssessmentResult);
    }
  }

  compile_assessment() {
    for (let i = 0; i < this.arrAssessmentResult.length; i++) {
      if (this.arrAssessmentResult[i].result == 'Wrong') {
        this.error_count = this.error_count + 1;
        let index = this.arrAssessmentType2.findIndex(
          (p: any) => p.question_id == this.arrAssessmentResult[i].question_id
        );
        this.arrAssessmentType2[index].is_correct = false;
      }
    }
    this.reset_choices();
    console.log('Error Count :', this.error_count);
    if (this.error_count === 0) {
      let arrCorrectResponse = this.arrAssessmentType2.filter(
        (p: any) => (p.is_correct = true)
      );
      if (arrCorrectResponse.length === this.arrAssessmentResult.length) {
        console.log('Save Module Assessment');
        let now = dayjs();
        let param = {
          session_id: this.create_session_id(),
          student_id: this.arrKeyObj.student_id,
          course_id: this.arrKeyObj.course_id,
          module_id: this.arrKeyObj.module_id,
          assessment_type: 2,
          has_completed: 1,
          remarks: 'Well done',
          date_time: now.format('YYYY-MM-DD') + ' ' + now.format('HH:mm:ss'),
          chCode: 'hg_gt78999@%^&',
          queryId: '3',
        };
        console.log(param);

        this.save_data_to_student_progress(param);
      } else {
        console.log('All questions are not answered');
      }
    }
  }
  counter: number = 0;
  save_data_to_student_progress(data: any) {
    this.backendService.SubmitQueryStudent(data).subscribe((resp: any) => {
      if (resp.ResponseCode == '401') {
        console.log('No data...');
      } else {
        console.log('Data : ', resp);
        for (let i = 0; i < this.arrAssessmentResult.length; i++) {
          let params = {
            session_id: data.session_id,
            question_id: this.arrAssessmentResult[i].question_id,
            answer: this.arrAssessmentResult[i].answer,
            chCode: 'hg_gt78999@%^&',
            queryId: '4',
          };
          this.save_data_to_progress_breakdown(params);
          this.counter++;
        }

        if (this.counter == this.arrAssessmentResult.length) {
          this.update_student_progress_state();
          console.log('Updating Student Progress State');
        }
      }
    });
  }

  save_data_to_progress_breakdown(data: any) {
    this.backendService.SubmitQueryStudent(data).subscribe((resp: any) => {
      if (resp.ResponseCode == '401') {
        console.log('No data...');
      } else {
        console.log('Data : ', resp);
        return;
      }
    });
  }

  create_session_id() {
    const d = new Date();
    return d.getTime();
  }

  update_student_progress_state() {
    const data = {
      student_email: 'smhumayonreza@gmail.com',
      passwd: 'admin',
      chCode: 'hg_gt78999@%^&',
      queryId: '1',
    };
    this.backendService.SubmitQueryStudent(data).subscribe((resp: any) => {
      if (resp.ResponseCode == '401') {
        console.log('No data...');
      } else {
        this.stateService.arrContents = resp[0];
        localStorage.setItem('session_ls', JSON.stringify(resp[0]));
        this.stateService.arrProgressAssessment1 = resp[0].progress_assessment1;
        this.stateService.arrProgressAssessment2 = resp[0].progress_assessment2;

        console.log('Data @state: ', resp);
        console.log(
          'prog_assessment1',
          this.stateService.arrProgressAssessment1
        );
        console.log(
          'prog_assessment2',
          this.stateService.arrProgressAssessment2
        );
        // this.router.navigate(['access-course']);
      }
    });
  }

  reset_choices() {
    for (let i = 0; i < this.arrAssessmentType2.length; i++) {
      for (let k = 0; k < this.arrAssessmentType2[i].options.length; k++) {
        this.arrAssessmentType2[i].options[k].is_selected = 0;
      }
    }
  }

  ngOnInit(): void {
    console.log('Text Component :', this.arrAssessmentType2);
    console.log('Student ID : ', this.arrKeyObj.student_id);
  }
}
