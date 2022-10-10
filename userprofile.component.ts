import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'projects/sharedbusiness/src/services/data.service';
import { apiUrls } from 'projects/sharedbusiness/src/environments/apiUrls';
import { appmasterapiUrls } from 'projects/appmaster/src/environments/appmasterapiUrls';
import { DeleteModelComponent } from '../../../../sharedbusiness/src/app/delete-model/delete-model.component';
import { Router } from '@angular/router';
import { ApiService } from 'projects/sharedbusiness/src/services/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataGridComponent } from '../../../../sharedbusiness/src/app/data-grid/data-grid.component';
import { MatDialog } from '@angular/material';
@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss']
})
export class UserprofileComponent implements OnInit {
  subCategoryObj: any;
  arr1 = [];
  profileListHeader: any;
  profileListTableKeys: any;
  searchFilters: any;
  listApi: any;
  actionKeys: string[];
  apiParams: any;
  exportFile: any;
  filters: any;
  uploadApi = apiUrls.addUserProfileBulk;
  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
  datagridshow: boolean = false;
  Receviedatagridshow: boolean = false;
  stopInitApiLoad = true;
  transferApi: any = appmasterapiUrls.getTransferList;
  recevieApi: any = appmasterapiUrls.getTransferReceiveList;
  recevieApiParams: any;
  recevieactionKeys: any = [];
  recevieListTableKeys: any;
  recevieListHeader: any;
  recevieprocessData: any = {
    user_name: "",
    user_uuid: "",
    from_fcility_name: "",
    from_location_uuid: "",
    to_fcility_name: "",
    to_location_uuid: "",
    dept_name: "",
    from_department_uuid: '',
    to_department_uuid: null
  };


  transferDataList: any = [];
  transferTotalcount: any;
  recevieDataList: any = [];
  recevieTotalcount: any;
  currentPage = 0;
  ReccurrentPage = 0;
  srno = 0;
  resrno = 1;
  showEntriesCount = 10;
  searchUsername: any;
  Recevie_Username: any;

  tooltipInstituteName: any
  tooltipUsereName: any
  tooltiDepteName: any
  tooltiToInstituteName: any

  // 2nd Model variable
  show_userlist: any = [];
  show_From_institutionList: any = [];
  show_To_institutionList: any = [];
  show_DepartmentList: any = [];
  UserName: any;
  UserID: any;
  From_institution: any;
  To_institution: any;
  Department: any;
  // 2nd Model variable


  receviefilter: any = {
    fromDate: false,
    toDate: false,
    individualSearch: false,
    addNewBtnName: '',
    addNewBtn: false,
    headerlabel: true,
    summary: true,
    searchtab: false,
    selectAllBindingKey: '',
    search: false


  };
  recevieexportFile = {
    excel: false,
    pdf: false,
    csv: false,
    print: false,
    upload: false
  }
  InstitutionList: any;


  paramsKeys9: any = {
    searchKey: 'search',
    selectDisplayKey: 'facility.name',
    selectBindingKey: 'facility_uuid',
    labelName: 'To Institution',
    dataType: 'object',
    getApiMethod: 'post',
    getSelectBindingKey: 'facility_uuid',
    getSelectDisplayKey: 'facility.name',
    minLength: 3
  };
  searchApiParams2 = {
    sortOrder: 'ASC',
    sortField: 'facility.name',
    status: true,
    paginationSize: 10,
    pageNo: 0,
    search: '',
    userId: sessionStorage.getItem('LoginId')
  };
  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 

  constructor(private router: Router, public dataService: DataService, private apiService: ApiService, private modalService: NgbModal, public dialog: MatDialog) {
    this.dataService.storageValueChange.subscribe(val => {
    });
  }

  ngOnInit() {
    this.getControls();
  }
  getControls() {
    const code = 'USR001';
    // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
    let transfer = false;
    let receive = false;
    // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
    let add = false;
    let uplad = false;
    let down = false;
    let edit = false;
    let dlt = false;
    let view = false;
    let searc = false;
    let clea = false;
    this.apiService.getRole(code).subscribe(val => {
      // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
      console.log("hiren ---- getrole---->", val);
      transfer = true;
      receive = true;
      // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
      this.arr1 = val;
      let arr = [];
      arr = this.arr1;
      add = arr.some(e => e.code === 'USERADD');
      uplad = arr.some(e => e.code === 'USERUPLO');
      down = arr.some(e => e.code === 'USERDOWN');
      edit = arr.some(e => e.code === 'USEREDIT');
      dlt = arr.some(e => e.code === 'USERDELE');
      view = arr.some(e => e.code === 'USERVIEW');
      searc = arr.some(e => e.code === 'USERSEAR');
      clea = arr.some(e => e.code === 'USERCLEA');
      if (this.arr1.length > 0) {
        this.profileListHeader = [
          'appmaster.userprofile.profilename',
          'appmaster.userprofile.departments',
          'appmaster.userprofile.gender',
          'appmaster.userprofile.usertype',
          'appmaster.userprofile.role',
          'appmaster.userprofile.loginname',
          'appmaster.userprofile.status',
          'appmaster.userprofile.Action',
        ];

        this.profileListTableKeys = [

          {
            data: 'first_name',
            className: 'text-capitalize ovrflw-txt-250px',
            render(data, type, row) {
              return (data ? data : '');
            }
          },
          {
            data: 'department.name',
            className: 'text-capitalize ovrflw-txt-250px',
            render(data, type, row) {
              return (data ? data : '');
            }
          },
          {
            data: 'gender.name',
            className: 'text-capitalize',
            render(data, type, row) {
              return (data ? data : '');
            }
          },
          {
            data: 'user_type.name',
            className: 'text-capitalize',
            render(data, type, row) {
              return (data ? data : '');
            }
          },


          {
            data: 'role.role_name',
            className: 'text-capitalize ovrflw-txt-250px',
            render(data, type, row) {
              return (data ? data : '');
            }
          },

          {
            data: 'user_name',
            className: 'text-capitalize ovrflw-txt-250px',
            render(data, type, row) {
              return (data ? data : '');
            }
          },
          {
            data: 'is_active',
            className: 'text-left',
            render(data, type, row) {
              // tslint:disable-next-line:triple-equals
              if (data == true) {
                return `<span class='badge col-green' title='Active'>Active</span>`;
                // tslint:disable-next-line:triple-equals
              } else if (data == false) {

                return `<span class='badge col-red' title='Inactive'>InActive</span>`;
              }
            }
          },
          {
            data: 'action',
            className: 'text-center',
            orderable: false,
            render(data, type, row) {
              let icon = '';
              if (edit === true) {
                icon = icon + `<i style="cursor:pointer" class="fas fa-edit text-blue action m-r-10" id="edit" title="Edit"> </i>`;
              } else {
              }
              if (view === true) {
                icon = icon + `<i style="cursor:pointer" class="fa fa-eye text-warning m-r-10 action" id="view" title="View"></i>`;
              } else {
              }
              if (dlt === true) {
                icon = icon + `<i style="cursor:pointer" class="fa fa-trash-alt text-danger action" id="delete" title="Delete"></i>`;
              } else {
              }
              return icon;
            }
          },
        ];

        this.searchFilters = [
          {
            inputType: 'input',
            lableName: 'appmaster.userprofile.Login/Name',
            searchKey: 'loginname',
            selectBindingKey: 'uuid',
            selectDisplayName: '',
            parentKey: 'uuid',
            api: '',
            parentIdx: '',
            idx: '1',
          },

          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.Institution',
            searchKey: 'facility_uuid',
            selectBindingKey: 'uuid',
            selectDisplayName: 'name',
            parentKey: 'uuid',
            api: appmasterapiUrls.getFacilityList,
            getApi: apiUrls.getFacilityById,
            getApiRequestData: { Id: sessionStorage.getItem('Institution_uuid') },
            getApiRequestType: 'post',
            getSelectBindingKey: 'facility.uuid',
            getSelectDisplayKey: 'facility.name',
            defaultValue: sessionStorage.getItem('Institution_uuid'),
            parentIdx: '',
            idx: '2',
            autocompleteSearchKey: 'name',
            apiRequestType: 'post'
          },
          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.DepartmentName',
            searchKey: 'departmentId',
            selectBindingKey: 'uuid',
            selectDisplayName: 'name',
            parentKey: 'uuid',
            apiRequestKey: 'facilityId',
            apiRequestData: {
              userBased: false,
              facilityBased: true,
              pageNo: 0,
              paginationSize: 100,
            },
            uiSelect: true,
            api: apiUrls.getAllDepartment,
            parentIdx: '2',
            idx: '3',
            autocompleteSearchKey: 'search',
            apiRequestType: 'post'
          },
          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.UserType',
            uiSelect: true,
            searchKey: 'usertypeId',
            selectBindingKey: 'uuid',
            selectDisplayName: 'name',
            parentKey: 'uuid',
            api: apiUrls.getUserType,
            parentIdx: '',
            idx: '4',
            apiRequestType: 'post'
          },

          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.UserRole',
            searchKey: 'userroleId',
            selectBindingKey: 'uuid',
            selectDisplayName: 'role_name',
            parentKey: 'uuid',
            api: apiUrls.getAllRole,
            parentIdx: '',
            idx: '5',
            autocompleteSearchKey: 'search',
            apiRequestType: 'post'
          },
          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.labResultApprover',
            searchKey: 'is_result_approve',
            selectBindingKey: 'value',
            selectDisplayName: 'status',
            idx: '6',
            respData: [{
              value: 1,
              status: 'Yes'
            }, {
              value: 0,
              status: 'No'
            }]
          },
          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.grievance',
            searchKey: 'is_grievance_officer',
            selectBindingKey: 'value',
            selectDisplayName: 'status',
            idx: '7',
            respData: [{
              value: '1',
              status: 'Yes'
            }, {
              value: '0',
              status: 'No'
            }]
          },
          {
            inputType: 'select',
            lableName: 'appmaster.userprofile.Status',
            searchKey: 'status',
            selectBindingKey: 'value',
            selectDisplayName: 'status',
            defaultValue: 1,
            idx: '8',
            respData: [{
              value: 1,
              status: 'Active'
            }, {
              value: 0,
              status: 'Inactive'
            }]
          },
        ];

        this.listApi = apiUrls.getUserprofile;
        this.actionKeys = ['view', 'edit', 'delete'];
        this.apiParams = {
          pageNo: 0,
          paginationSize: 10,
          sortOrder: 'DESC',
          searchKey: 'search',
          sortField: 'modified_date',
          search: '',
          searchPrivlg: searc,
          clear: clea,
          status: 1,
          office_user: sessionStorage.getItem('officeUser'),
          office_uuid: sessionStorage.getItem('Office_uuid'),
          is_global_search: true
        };

        this.exportFile = {
          excel: down,
          pdf: false,
          csv: false,
          print: false,
          upload: uplad,
          // Hiren Shiyani H30-50804 AppMaster for User Profile : Integrate one getUserTempleteExcel API
          template: true
          // Hiren Shiyani H30-50804 AppMaster for User Profile : Integrate one getUserTempleteExcel API
        };

        this.filters = {
          fromDate: false,
          toDate: false,
          individualSearch: false,
          addNewBtnName: 'appmaster.userprofile.add',
          addNewBtn: add,
          // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
          transferNewBtnName: 'appmaster.userprofile.transfer',
          transferNewBtn: transfer,
          transferbtn: false, // if true then button is disabled
          receiveNewBtnName: 'appmaster.userprofile.receive',
          receiveNewBtn: receive,
          receivebtn: false, // if true then button is disabled
          totalreciver: 0,
          // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
          summary: false,
          headerlabel: false,
          searchtab: true,
          selectAllBindingKey: 'id',
          search: true,
          addReceive: true,
          addTransfer: true
        };
        // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
        this.get_all_receviv_count();
      }
    });
  }
  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
  get_all_receviv_count() {
    this.apiService.post(appmasterapiUrls.getTransferReceiveList, { pageNo: 0, pageSize: 10000 }).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_userlist ---> ",response);
        this.filters['totalreciver'] = response.responseContents.length
        this.dataService.reloadTable();
      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }
  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
  actionEvent(evt) {
    // tslint:disable-next-line:triple-equals
    console.log("hiren --- actionevent ---->", evt);

    if (evt.rowId == 'view') {
      this.dataService.individualUserId = evt.rowData.uuid;
      this.viewProfile(evt.rowData.uuid);

    }
    // tslint:disable-next-line:triple-equals
    if (evt.rowId == 'edit') {
      this.dataService.individualUserId = evt.rowData.uuid;
      this.addprofile(evt.rowData.uuid);
    }
    // tslint:disable-next-line:triple-equals
    if (evt.rowId == 'add') {
      this.addprofile();
    }
    // tslint:disable-next-line:triple-equals
    if (evt.rowId == 'delete') {
      this.deleteUserProfileName(evt);
    }
    // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 

    if (evt.rowId == 'transfer') {
      // transfer btn function called
      this.transfer_list_model_open();
    }
    if (evt.rowId == 'receiv') {
      // receiv btn function called
      this.recevie_list_model_open();

    }
    // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 

  }
  downloadExcel(excelData) {
    this.dataService.downloadExcelCSV(excelData, 'userprofile', 'excel', [this.profileListHeader, this.profileListTableKeys]);
  }

  downloadPdf(pdfData) {
    this.dataService.downloadPdf(this.profileListHeader, pdfData, 'userprofile', [this.profileListHeader, this.profileListTableKeys]);
  }

  downloadCSV(csvData) {
    this.dataService.downloadExcelCSV(csvData, 'userprofile', 'csv', [this.profileListHeader, this.profileListTableKeys]);
  }
  // Hiren Shiyani H30-50804 AppMaster for User Profile : Integrate one getUserTempleteExcel API
  downloadTemplate() {
    console.log("hiren ----- downloadTemplate --->");

    this.apiService.apiWithoutLoader(appmasterapiUrls.getUserTempleteExcel, 'post', {}, true, true).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      console.log("hiren ----- before getUserTempleteExcel ---> ", response);
      if (response instanceof Blob) {

        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileURL = URL.createObjectURL(blob);
        // create <a> tag dinamically
        var fileLink = document.createElement('a');
        fileLink.href = fileURL;

        // it forces the name of the downloaded file
        fileLink.download = 'User_Profile_Template_Data';

        // triggers the click event
        fileLink.click();

      } else {
        console.log("hiren --- blob else -----?");

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });

  }
  // Hiren Shiyani H30-50804 AppMaster for User Profile : Integrate one getUserTempleteExcel API
  viewProfile(profileId?: string) {
    if (profileId) {
      this.dataService.savePageRedirectionId(profileId);
      this.router.navigate(['masters/user-profile/view', profileId]);
    } else {
      this.router.navigate(['masters/user-profile/view']);
    }
  }

  addprofile(villageId?: string) {
    if (villageId) {
      this.dataService.savePageRedirectionId(villageId);
      this.router.navigate(['masters/user-profile/edit', villageId]);
    } else {
      this.router.navigate(['masters/user-profile/add']);
    }
  }


  deleteUserProfileName(evt) {
    const modalRef = this.modalService.open(DeleteModelComponent);
    modalRef.componentInstance.recordName = evt.rowData.first_name;
    modalRef.result.then(respData => {
      if (respData) {
        const postingdata = {
          Id: evt.rowData.uuid
        };
        this.apiService.post(apiUrls.deleteprofile, postingdata).toPromise().then((response: any) => {
          // tslint:disable-next-line:triple-equals
          if (response.statusCode == 200) {
            this.dataService.showAlert(evt.rowData.first_name + ' Deleted Successfully.', 'success');
            this.dataService.translateData(['common.message.deleted'], {
              component: evt.rowData.first_name
            }).then(translateData => {
              this.dataService.showAlertdelete(translateData[0], 'success', false, '');
            });
            this.dataService.reloadTable();
            this.router.navigate(['masters/user-profile/list']);
          }
        }).catch((err: any) => {
          this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
        });
      }
    }).catch(err => {
    });
  }

  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 
  // trasfer model code started ......
  closeTransferListPopUp() { /* Transfer Model Closed Funcation ... */
    this.UserName = []
    this.UserID = null
    this.From_institution = []
    this.To_institution = []
    this.Department = []
    this.srno = 0; this.currentPage = 1;
    this.searchUsername = null;
    this.Recevie_Username = null;
    this.get_all_receviv_count();

    $('#TransferRequestList').modal('hide');
  }

  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 

  transfer_list_model_open() { /* Transfer Model Open funcation ...*/
    this.srno = 0;
    const postingdata = {
      pageNo: 0,
      pageSize: 10,

    };
    this.Get_Transfer_List(postingdata);

    this.get_All_userlist();
    this.get_All_To_institution();

    $('#TransferRequestList').modal('show');

  }

  loadPage(e: any, ser: any) { /* Transfer Model Pagination Funcation ... */
    console.log("hiren ---load ---> ", e);
    console.log("hiren ---ser ---> ", ser);
    console.log("hiren ---ser ---> ", this.searchUsername);
    this.srno = e - 1;
    console.log("hiren ---ser ---> ", this.srno);

    if (this.searchUsername) { /* In search value is there then with search pagination load */
      const postingdata = {
        pageNo: e - 1,
        pageSize: 10,
        search: this.searchUsername,

      };
      this.Get_Transfer_List(postingdata);
    } else { /* without search pagination Load */

      const postingdata = {
        pageNo: e - 1,
        pageSize: 10,

      };
      this.Get_Transfer_List(postingdata);
    }
  }

  On_search_username(e: any) { /* Transfer Model Search Funcation ... */
    // console.log("hiren ---- search ----->", e);
    console.log("hiren ---- searchUsername ----->", this.searchUsername);
    this.srno = 0;
    this.currentPage = 1;
    if (this.searchUsername) { /* with search api call */

      const postingdata = {
        pageNo: 0,
        pageSize: 10,
        search: this.searchUsername,

      };
      this.Get_Transfer_List(postingdata);

    } else { /* without search api call */
      const postingdata = {
        pageNo: 0,
        pageSize: 10,

      };

      this.Get_Transfer_List(postingdata);
    }

  }

  Get_Transfer_List(payload: any) { /* Transfer Data get API Funcation ... */
    this.apiService.post(appmasterapiUrls.getTransferList, payload).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_userlist ---> ",response);
        this.transferDataList = (response.responseContents ? response.responseContents : [])
        this.transferTotalcount = response.totalRecords

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  Open_User_Transfer() { /* In Transfer Model - Transfer process another model open funcation ... */
    $('#usertrasfermodel').modal('show');
  }

  closeUserTrasferPopUp() { /* In Transfer Second Model (User transfer) Closed Funcation ... */
    let payload = {
      page: this.currentPage,
      pageSize: 10
    }
    this.Get_Transfer_List(payload);
    this.show_To_institutionList = [];
    this.show_DepartmentList = [];

    $('#usertrasfermodel').modal('hide');

  }

  get_All_userlist() { /* Get All User Name Funcation ... */
    let facility_uuid: any = sessionStorage.getItem('Institution_uuid')

    const postingdata = {
      "facility_uuid": facility_uuid,
      "pageNo": 0,
      "paginationSize": 1000,
      "sortField": "first_name",
      "sortOrder": "DESC",
      "is_active": 1,
      "search": "%%%"
    };
    // console.log("payload ---> ",postingdata);

    this.apiService.post(appmasterapiUrls.getUserprofile, postingdata).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_userlist ---> ",response);
        this.show_userlist = (response.responseContents ? response.responseContents : [])

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  On_Username_Change(e: any) { /* User name change Funcation ... */
    this.From_institution = [];
    this.Department = [];
    this.tooltipUsereName = '';
    this.tooltipInstituteName = '';
    this.tooltiDepteName = '';
    if (e === undefined) {
      this.From_institution = [];
      this.Department = [];
    } else {
      this.UserID = e
      this.tooltipUsereName = e.first_name
      this.get_All_From_institution(e.uuid);
      this.get_All_Department(e.facility.uuid);
    }
  }

  get_All_From_institution(userId) { /* get All From Institution Funcation ... */
    const postingdata = {
      "sortOrder": "ASC",
      "sortField": "facility.name",
      "status": true,
      "paginationSize": 10,
      "pageNo": 0,
      "search": "%%%",
      "userId": userId
    };
    // console.log("hiren   payload --get_All_From_institution-->", postingdata);

    this.apiService.post(appmasterapiUrls.getInstitutionByUId, postingdata).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_From_institution ---> ", response);
        this.show_From_institutionList = (response.responseContents ? response.responseContents : [])
        this.From_institution = (this.UserID.facility.uuid);
        this.show_From_institutionList.forEach(element => {
          if (element.facility_uuid === this.UserID.facility.uuid) {
            this.tooltipInstituteName = element.facility.name
          }
        });

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  On_From_Ins_Change(e: any) { /* On Chnage Institution Funcation ... */

    this.Department = [];

    this.tooltipInstituteName = '';
    this.tooltiDepteName = '';
    if (e === undefined) {
      this.Department = [];
    } else {
      this.show_DepartmentList = [];

      this.tooltipInstituteName = e.facility.name
      this.get_All_Department(e.facility_uuid);
    }
  }

  get_All_Department(facility_uuid) { /* Get All Department Funcation ... */
    const postingdata = {
      "facility_uuid": facility_uuid,
      "Id": this.UserID.uuid,
      "sortField": "department.name",
      "sortOrder": "asc"
    };

    // console.log("hiren   payload --get_All_Department-->", postingdata);

    this.apiService.post(appmasterapiUrls.getDepartmentByFacilityId, postingdata).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_Department ---> ", response);
        this.show_DepartmentList = (response.responseContents ? response.responseContents : [])
        this.Department = (this.UserID.department.uuid);
        this.show_DepartmentList.forEach(element => {
          if (element.department_uuid === this.UserID.department.uuid) {
            this.tooltiDepteName = element.department.name
          }
        });

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  get_All_To_institution() { /* Get All To Institutuion Funcation ... */
    const postingdata = {
      "sortOrder": "DESC",
      "sortField": "created_date",
      "status": "",
      "searchKey": "%%%",
      "name": "%%%",
      "pageNo": 0,
      "paginationSize": 10
    };
    // console.log("hiren   payload --get_All_To_institution-->", postingdata);

    this.apiService.post(appmasterapiUrls.getFacilityList, postingdata).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_To_institution ---> ", response);
        this.show_To_institutionList = (response.responseContents ? response.responseContents : [])
      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  On_Transfer() { /* In Transfer Second Model On Transfer Click Funcation... */


    if (!this.UserName || !this.From_institution || !this.Department || !this.To_institution) {
      this.dataService.showAlertdelete('Plz select all data.', 'error', false, '', 'common.buttons.ok');

    } else {
      const payload = {
        "user_uuid": this.UserName,
        "from_fcility_uuid": this.From_institution,
        "from_dept_uuid": this.Department,
        "to_facility_uuid": this.To_institution
      }
      // console.log("hiren ----payload --->",payload);

      this.apiService.post(appmasterapiUrls.postTransfer, payload).toPromise().then((response: any) => {
        // tslint:disable-next-line:triple-equals
        if (response.statusCode == 200) {
          // console.log("hiren ----- get_All_To_institution ---> ", response);

          this.dataService.showAlertNew('User transfer Done', 'common.message.addedSuccess', 'success').then(() => {
            this.UserName = [];
            this.UserID = null;
            this.From_institution = [];
            this.To_institution = [];
            this.Department = [];

          });

          //  this.dataGrid.ngAfterViewInit();
          this.closeUserTrasferPopUp();
        }
      }).catch((err: any) => {
        this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
      });

    }

  }

  On_Transfer_Revert(e: any) { /* On Transfer Revert Funcation ... */
    console.log("hiren ---> ", e);

    const payload = {
      "user_uuid": e
    }
    this.apiService.post(appmasterapiUrls.postTransferRevert, payload).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_To_institution ---> ", response);

        this.dataService.showAlertNew('User Revert Done', 'common.message.addedSuccess', 'success').then(() => {
          this.currentPage = 1;
          this.srno = 0
          const postingdata = {
            pageNo: 0,
            pageSize: 10,

          };
          this.Get_Transfer_List(postingdata);
        });
      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  // trasfer model code Done ......

  recevie_list_model_open() { /* Recevie Model Open Funcation ... */

    this.srno = 0;
    const postingdata = {
      pageNo: 0,
      pageSize: 10,

    };
    this.Get_Recevie_List(postingdata);

    $('#UserRecevieList').modal('show');
  }
  closeRecevieListPopUp() { /* Recevie Model close Funcation ... */
    this.srno = 0; this.ReccurrentPage = 1;
    this.searchUsername = null;
    this.Recevie_Username = null;
    this.get_all_receviv_count();

    $('#UserRecevieList').modal('hide');
  }

  Recevie_loadPage(e: any, ser: any) { /* Recevie Model Pagination Funcation ... */
    console.log("hiren ---load ---> ", e);
    console.log("hiren ---ser ---> ", ser);
    this.srno = e - 1;
    if (this.Recevie_Username) { /* In search value is there then with search pagination load */
      const postingdata = {
        pageNo: e - 1,
        pageSize: 10,
        search: this.Recevie_Username,

      };
      this.Get_Recevie_List(postingdata);
    } else { /* without search pagination Load */

      const postingdata = {
        pageNo: e - 1,
        pageSize: 10,

      };
      this.Get_Recevie_List(postingdata);
    }
  }

  On_Recevie_search_username(e: any) { /* Recevie Model Search Funcation ... */
    console.log("hiren ---- search ----->", e);
    this.srno = 0;
    this.ReccurrentPage = 1;
    if (this.Recevie_Username) { /* with search api call */

      const postingdata = {
        pageNo: 0,
        pageSize: 10,
        search: this.Recevie_Username,

      };
      this.Get_Recevie_List(postingdata);

    } else { /* without search api call */
      const postingdata = {
        pageNo: 0,
        pageSize: 10,

      };

      this.Get_Recevie_List(postingdata);
    }

  }

  Get_Recevie_List(payload: any) { /* Recevie Data get API Funcation ... */
    this.apiService.post(appmasterapiUrls.getTransferReceiveList, payload).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_userlist ---> ",response);
        this.recevieDataList = (response.responseContents ? response.responseContents : [])
        this.recevieTotalcount = response.totalRecords

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  On_Recive_accept_Model_Open(e: any) { /* In Recevie Model another model open for accept | revert process ... */
    console.log("hiren --- opern othr model in recive ---> ", e);
    this.recevieprocessData = {
      user_name: e.user_name,
      user_uuid: e.user_uuid,
      from_fcility_name: e.from_fcility_name,
      from_location_uuid: e.from_location_uuid,
      to_fcility_name: e.to_fcility_name,
      to_location_uuid: e.to_location_uuid,
      dept_name: e.dept_name,
      from_department_uuid: e.from_department_uuid,

    };
    this.get_all_dept_by_institution(e.to_location_uuid);

    $('#userreceviemodel').modal('show');
  }

  get_all_dept_by_institution(id) {
    const postingdata = {
      "facility_uuid": id,
      "sortField": "department.name",
      "sortOrder": "asc"
    };

    // console.log("hiren   payload --get_All_Department-->", postingdata);

    this.apiService.post(appmasterapiUrls.addFacilityDeptMap, postingdata).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_Department ---> ", response);
        this.show_DepartmentList = (response.responseContents ? response.responseContents : [])

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  closeUserReceviePopUp() { /* In Recevie Model another model Close for accept | revert process ... */
    this.recevieprocessData = {
      user_name: '',
      user_uuid: '',
      from_fcility_name: '',
      from_location_uuid: '',
      to_fcility_name: '',
      to_location_uuid: '',
      dept_name: '',
      from_department_uuid: '',
      to_department_uuid: ''
    };

    $('#userreceviemodel').modal('hide');
  }

  On_Recevie_Revert() { /*On Recevie Revert Funcation ... */
    const payload = {
      "user_uuid": this.recevieprocessData.user_uuid
    }
    this.apiService.post(appmasterapiUrls.postTransferRevert, payload).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_To_institution ---> ", response);

        this.dataService.showAlertNew('User Revert Done', 'common.message.addedSuccess', 'success').then(() => {
          this.ReccurrentPage = 1;
          this.srno = 0;
          const postingdata = {
            pageNo: 0,
            pageSize: 10,

          };
          this.Get_Recevie_List(postingdata);
          this.closeUserReceviePopUp();
        });
      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });
  }

  On_Receviv_Accept() { /* Recevie Accept PRocess Funcation ... */
    const payload = {
      "user_uuid": this.recevieprocessData.user_uuid,
      "to_facility_uuid": this.recevieprocessData.to_location_uuid,
      "to_dept_uuid": this.recevieprocessData.to_department_uuid
    }

    console.log("hirne --- payload of recevie accept --->", payload);

    this.apiService.post(appmasterapiUrls.postTransferRecevied, payload).toPromise().then((response: any) => {
      // tslint:disable-next-line:triple-equals
      if (response.statusCode == 200) {
        // console.log("hiren ----- get_All_To_institution ---> ", response);

        this.dataService.showAlertNew('User Recevie Done', 'common.message.addedSuccess', 'success').then(() => {
          this.closeUserReceviePopUp();
          this.srno = 0;
          this.ReccurrentPage = 1;
          const postingdata = {
            pageNo: 0,
            pageSize: 10,

          };
          this.Get_Recevie_List(postingdata);
        });

      }
    }).catch((err: any) => {
      this.dataService.showAlertdelete('common.errors.wentwrong', 'error', false, '', 'common.buttons.ok');
    });

  }



  showInstituteOnTooltip(type, data, name) { /* tool tip funcartion ... */
    const selectedData = [];
    data.forEach(e => {

      if (type === 'username') {


        if (name) {
          if (e.uuid === name) {
            this.tooltipInstituteName = '';
            this.tooltiDepteName = '';
            this.tooltipUsereName = e.first_name

          }
        }
      }
      if (type === 'fromins') {

        if (name) {
          if (e.facility_uuid === name) {
            this.tooltipInstituteName = '';
            this.tooltiDepteName = '';
            this.tooltipInstituteName = e.facility.name
          }
        }

      }
      if (type === 'dept') {

        if (name) {
          if (e.department_uuid === name) {
            this.tooltiDepteName = '';
            this.tooltiDepteName = e.department.name
          }
        }
      }
      if (type === 'toins') {
        if (name) {
          if (e.uuid === name) {
            this.tooltiToInstituteName = '';

            this.tooltiToInstituteName = e.name
          }
        }

      }
    });

  }

  On_Dept_Change(e: any) { /* On Chnage Dept Funcation ... */


    if (e === undefined) {
      this.tooltiDepteName = '';
    }
  }
  On_To_ins_Change(e: any) { /* On Chnage To Institution Funcation ... */


    if (e === undefined) {
     
      this.tooltiToInstituteName = '';
    }
  }
  // Hiren Shiyani H30-50660 User transfer to other institutions - Flow need to be discussed BA(s) contact HMIS Specialist 

}
