<?php

/**
 * All responses have jason encoded format ['success' => boolean]
 * Additionaly 'error' => string may exists if single error appear
 */
class ApiController extends CController
{
    
    protected $showHidden = false;
    
    public function beforeAction($action)
    {
        if (Yii::app()->user->isGuest && !in_array($action->id, array('login')))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('general', 'Not authorized')));
            Yii::app()->end();
        }
        if (!Yii::app()->user->isGuest && Yii::app()->user->getUser()->is_inactive)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('general', 'Inactive user')));
            Yii::app()->end();
        }
        return true;
    }

    /**
     * Login attempt
     * Excpected $_POST['model'] = ['username' => string, 'password' => string, 'rememberMe' => boolean]
     * Return additional 'errors' => [field => [errors]] if validation errors exists, 'error' => string is auth failed, 'type' => user type(ROLE_USER .. ROLE_SUPER_ADMIN)
     */
    public function actionLogin()
    {
        $model = new LoginForm();
        $model->attributes = Yii::app()->request->getPost('model');
        if (!$model->validate())
        {
            echo json_encode(array('success' => false, 'errors' => $model->errors));
            Yii::app()->end();
        }
        if (!$model->login())
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('general', 'User with specified combination of login and password is not found')));
            Yii::app()->end();
        }
        echo json_encode(array('success' => true, 'type' => Yii::app()->user->getUser()->type, 'id' => Yii::app()->user->getUser()->id, 'working_time' => Schedule::getTodaysWorkingTimeBeginEnd()));
    }

    /**
     * Logout
     */
    public function actionLogout()
    {
        Yii::app()->user->logout();
        echo json_encode(array('success' => true));
    }

    /**
     * Get user tasks
     * Expected optional $_POST['user'] - user id who tasks should be returned. By default return tasks of current user
     * Return additional 'error' => string if error appear
     * If success return 'user' => ['id' => integer, 'name' => string], 'tasks' => [['id' => integer, 'time' => integer(seconds), 'current' => boolean, 'name' => string], ]
     */
    public function actionTasks()
    {
        $user = Yii::app()->request->getPost('user');
        if (!empty($user) && Yii::app()->user->getUser()->id != $user && Yii::app()->user->getUser()->type != User::ROLE_MANAGER && Yii::app()->user->getUser()->type != User::ROLE_ADMIN)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is not a manager/admin')));
            Yii::app()->end();
        }
        if (empty($user))
            $user = Yii::app()->user->id;
        if (!$this->checkDepartment($user) && Yii::app()->user->getUser()->type != User::ROLE_ADMIN)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is from another department')));
            Yii::app()->end();
        }
        $tasks = Task::model()->findAll('user_id=? AND active=? ORDER BY id DESC', array($user, TRUE));
        $user = User::model()->findByPk($user);
        if(empty($user)) {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'The user does not exist')));
            Yii::app()->end();
        }
        $ctask = Task::model()->find('user_id=? and current=?', array($user->id, 1));
        $data = User::getStatusTeam($user->id, Controller::getCurrentDate());
        $result = array(
            'success' => true,
            'user' => array(
                'id' => $user->id,
                'name' => $user->name,
                'startedTime' => (!empty($data['start']) ? strtotime($data['start']) : ''),
                'status' => (!empty($ctask) ? Yii::t('tasks', 'Working') : (!empty($data['end']) ? Yii::app()->dateFormatter->formatDateTime(TimeZoneHelper::getDateWithShift($data['end']), null, 'short') : '')),
                'phone' => preg_replace('/\D/', '', $user->phone),
                'userImage' => Yii::app()->getBaseUrl(true) . $user->getAvatarPath()
            ),
            'tasks' => array()
        );
        foreach ($tasks as $task)
        {
            $time = UserTime::getTimeByTask($task->user_id, $task->id);
            $result['tasks'][] = array(
                'id' => $task->id,
                'time' => intval($time['time']),
                'current' => $task->current ? true : false,
                'name' => $task->name,
                'description' => $task->description
            );
        }
        echo json_encode($result);
    }

    private function startOrStop($model, $start, $userId, $taskId)
    {
        if ($model->current == TRUE && !empty($start))
        {
            $model->current = false;
            $model->save(false);

            $user_time = UserTime::model()->findByPk($start->id);
            $start = $user_time->start;
            $end = (strtotime("now") >= strtotime(date('Y-m-d H:i') . ':' . date('s', strtotime($user_time->start)))) ? date('Y-m-d H:i') . ':' . date('s', strtotime($user_time->start)) : date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i', strtotime("now -1 minute")) . ':' . date('s', strtotime($user_time->start . " -1 minute"))));
            $result = false;
        }
        else
        {
            $command = Yii::app()->db->createCommand();
            $command->update('task', array('current' => 0), 'user_id = :uid', array(':uid' => $userId));

            $model->current = true;
            $model->save(false);

            $closeOther = UserTime::model()->find('user_id=? and end=? ORDER BY end DESC', array($userId, '9000-01-01 00:00:00'));
            if (!empty($closeOther))
            {
                $close = UserTime::model()->findByPk($closeOther->id);
                $end = (strtotime("now") >= strtotime(date('Y-m-d H:i') . ':' . date('s', strtotime($closeOther->start)))) ? date('Y-m-d H:i') . ':' . date('s', strtotime($closeOther->start)) : date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i', strtotime("now -1 minute")) . ':' . date('s', strtotime($closeOther->start . " -1 minute"))));
                $close->attributes = array('user_id' => $closeOther->user_id, 'task_id' => $closeOther->task_id, 'start' => $closeOther->start, 'end' => $end);
                $close->save();
            }

            $user_time = new UserTime;
            $start = date('Y-m-d H:i:s');
            $end = '9000-01-01 00:00:00';
            $result = true;
        }

        $user_time->attributes = array(
            'user_id' => $userId,
            'task_id' => $taskId,
            'start' => $start,
            'end' => $end
        );
        $user_time->save();
        return $result;
    }

    /**
     * Start task if not started, stop is started
     * Excpects $_POST['id'] - task id
     * Return additional 'error' => string if error appear
     * If success return 'started' => boolean - whether task started or stopped
     */
    public function actionToggle()
    {
        $model = Task::model()->findByPk(intval(Yii::app()->request->getPost('id')));
        if (empty($model))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Task is not found')));
            Yii::app()->end();
        }
        if ($model->user_id != Yii::app()->user->getUser()->id && Yii::app()->user->getUser()->type != User::ROLE_MANAGER && Yii::app()->user->getUser()->type != User::ROLE_ADMIN)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is not a manager/admin')));
            Yii::app()->end();
        }
        if ($model->user_id != Yii::app()->user->id && Yii::app()->user->getUser()->type != User::ROLE_ADMIN)
        {
            $command = Yii::app()->db->createCommand();
            $command->select('dep_id')->from('user_to_dep')->where('user_id = :uid1 OR user_id = :uid2')->group('dep_id')->having('count(user_id) > 1');
            $command->params[':uid1'] = Yii::app()->user->id;
            $command->params[':uid2'] = $model->user_id;
            $result = $command->queryAll();
            if (empty($result))
            {
                echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is from another department')));
                Yii::app()->end();
            }
        }
        $start = UserTime::model()->find('user_id=? and task_id=? ORDER BY end DESC', array($model->user_id, $model->id));
        $result = $this->startOrStop($model, $start, $model->user_id, $model->id);
        echo json_encode(array('success' => true, 'started' => $result));
    }

    /**
     * Create new task
     * Expected required $_POST['user_id'] - user id who was assigned to task
     * Expected required $_POST['task_id'] - task id which need to update
     * Expected required $_POST['title'] - title of task
     * Expected optional $_POST['description'] - description of task
     * If success return ['status' => boolean,]
     * If error return ['status' => boolean, 'error' => string]
     */
    public function actionCreateTask()
    {
        $user_id = Yii::app()->request->getPost('user_id');
        $task_id = Yii::app()->request->getPost('task_id');
        $title = Yii::app()->request->getPost('title');
        $description = Yii::app()->request->getPost('description', '');
        if (!empty($user_id) && Yii::app()->user->getUser()->id != $user_id && !in_array(Yii::app()->user->getUser()->type, array(User::ROLE_MANAGER, User::ROLE_ADMIN)))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is not a manager/admin')));
            Yii::app()->end();
        }
        if (empty($user_id))
        {
            $user_id = Yii::app()->user->id;
        }
        if (!$this->checkDepartment($user_id) && Yii::app()->user->getUser()->type != User::ROLE_ADMIN)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is from another department')));
            Yii::app()->end();
        }
        if (empty($title))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Task title is required')));
            Yii::app()->end();
        }
        if(!empty($task_id))
        {
            $task = Task::model()->findByPk($task_id);
            if(empty($task)) {
                echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Specified task doesn\'t exist')));
                Yii::app()->end();
            }
        } else {
            $task = new Task();
        }
        $task->name = $title;
        $task->description = $description;
        $task->user_id = $user_id;
        $task->date_end = '9000-01-01 00:00:00';
        $task->active = TRUE;
        $task->date_start = $task->isNewRecord ? date('Y-m-d H:i:s') : $task->date_start;
        if ($task->save())
        {
            echo json_encode(array('success' => true,));
            Yii::app()->end();
        }
        echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'DB error')));
        Yii::app()->end();
    }
    
    /**
     * Get Task model
     * Expected required $_POST['id'] - task id
     * If success return [task attributes]
     * If error return ['status' => boolean, 'error' => string]
     */
    public function actionGetTaskModel()
    {
        $id = Yii::app()->request->getPost('id');
        if(empty($id))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Task is not specified')));
            Yii::app()->end();
        }
        
        $model = Task::model()->findByPk($id);
        if(empty($model))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Specified task doesn\'t exist')));
            Yii::app()->end();
        }
        
        if(!in_array(Yii::app()->user->getUser()->type, array(User::ROLE_MANAGER, User::ROLE_ADMIN)) && $model->user_id != Yii::app()->user->getUser()->id)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is not a manager/admin')));
            Yii::app()->end();
        }
        
        if(Yii::app()->user->getUser()->type == User::ROLE_MANAGER && !$this->checkDepartment($model->user_id))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is from another department')));
            Yii::app()->end();
        }
        
        $result = array(
            'id' => $model->id,
            'title' => $model->name,
            'description' => $model->description,
            'user_id' => $model->user_id,
            'date_start' => $model->date_start,
            'date_end' => $model->date_end,
            'active' => $model->active,
            'current' => $model->current,
            'associated' => $model->associated,
            'jira_project' => $model->jira_project,
            'jira_task' => $model->jira_task,
            'jira_project_id' => $model->jira_project_id,
            'user_jira_id' => $model->user_jira_id,
        );
        echo json_encode($result);
        Yii::app()->end();
    }
    
    /**
     * Delete task
     * Expected required $_POST['id'] - task id
     * If success return ['status' => boolean,]
     * If error return ['status' => boolean, 'error' => string]
     */
    public function actionDeleteTask()
    {
        $id = Yii::app()->request->getPost('id');
        if(empty($id))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Task is not specified')));
            Yii::app()->end();
        }
        
        $model = Task::model()->findByPk($id);
        if(empty($model))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'Specified task doesn\'t exist')));
            Yii::app()->end();
        }
        
        if(!in_array(Yii::app()->user->getUser()->type, array(User::ROLE_MANAGER, User::ROLE_ADMIN)) && $model->user_id != Yii::app()->user->getUser()->id)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is not a manager/admin')));
            Yii::app()->end();
        }
        
        if(Yii::app()->user->getUser()->type == User::ROLE_MANAGER && !$this->checkDepartment($model->user_id))
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'User is from another department')));
            Yii::app()->end();
        }
        
        $modelLeftTasks = Task::model()->findAll('user_id = :user_id AND id != :id AND active = :active', array(':user_id' => $model->user_id, ':id' => $id, ':active' => 1));

        $result = array(
            'success' => true,
            'tasks' => array()
        );
        if(!empty($modelLeftTasks))
        {
            foreach($modelLeftTasks as $task)
            {
                $time = UserTime::getTimeByTask($task->user_id, $task->id);
                $result['tasks'][] = array(
                    'id' => $task->id,
                    'time' => intval($time['time']),
                    'current' => $task->current ? true : false,
                    'name' => $task->name
                );
            }
        }
        
        if($model->delete()) {
            echo json_encode($result);
            Yii::app()->end();
        }
        echo json_encode(array('success' => false, 'error' => Yii::t('tasks', 'DB error')));
        Yii::app()->end();
    }

    /**
     * Return team status     
     * If success return ['status' => boolean,]
     * If error return ['status' => boolean, 'error' => string]
     */
    public function actionTeamStatus()
    {
        if (Yii::app()->user->getUser()->type != User::ROLE_MANAGER && Yii::app()->user->getUser()->type != User::ROLE_ADMIN)
        {
            echo json_encode(array('success' => false, 'error' => Yii::t('team', 'User is not a manager/admin')));
            Yii::app()->end();
        }
        $departments = Department::getDepartmentsData($this->showHidden);
        $result = Yii::app()->user->getUser()->type == User::ROLE_ADMIN ? array('all' => array()) : array();
        
        foreach ($departments as $depId => $department)
        {
            $result[$depId] = array('title' => $department['title'], 'users' => array());
            foreach ($department['users'] as $user)
            {
                $ctask = Task::model()->find('user_id=? and current=?', array($user['id'], 1));
                $data = User::getStatusTeam($user['id'], Controller::getCurrentDate());
                $result[$depId]['users'][] = array(
                    'id' => $user['id'],
                    'name' => $user->name,
                    'startedTime' => (!empty($data['start']) ? strtotime($data['start']) : ''),
                    'status' => (!empty($ctask) ? Yii::t('team', 'Working') : (!empty($data['end']) ? Yii::app()->dateFormatter->formatDateTime(TimeZoneHelper::getDateWithShift($data['end']), null, 'short') : '')),
                );
                if(Yii::app()->user->getUser()->type == User::ROLE_ADMIN)
                {
                    $add = true;
                    foreach($result['all'] as $allUsers)
                    {
                        if(in_array($user['id'], $allUsers))
                        {
                            $add = false;
                        }
                    }
                    if($add)
                    {
                        $result['all'][] = array(
                            'id' => $user['id'],
                            'name' => $user->name,
                            'startedTime' => (!empty($ctask) ? strtotime($data['start']) : ''),
                            'status' => (!empty($ctask) ? Yii::t('team', 'Working') : (!empty($data['end']) ? Yii::app()->dateFormatter->formatDateTime(TimeZoneHelper::getDateWithShift($data['end']), null, 'short') : '')),
                        );
                    }
                }
            }
        }
        echo json_encode($result);
        Yii::app()->end();
    }

    /**
     * Check that is selected user belongs one department of current user
     * @param integer $user - user Id for check
     */
    protected function checkDepartment($user)
    {
        if ($user != Yii::app()->user->id)
        {
            $command = Yii::app()->db->createCommand();
            $command->select('dep_id')->from('user_to_dep')->where('user_id = :uid1 OR user_id = :uid2')->group('dep_id')->having('count(user_id) > 1');
            $command->params[':uid1'] = Yii::app()->user->id;
            $command->params[':uid2'] = $user;
            $result = $command->queryAll();
            if (empty($result))
            {
                return false;
            }
        }
        return true;
    }
    
    /**
     * get month working hours
     * @param integer $user - user Id for check
     * @param integer $year - year for check
     * @param integer $month - month Id for check
     */
    protected function workingHoursAndDayType($user, $year, $month)
    {
        $ym = $year . $month;
        $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        $command = Yii::app()->db->createCommand();
        $command->select('IF(start IS NOT NULL, TIME_TO_SEC(stop) - TIME_TO_SEC(start) - (break*60), 28800) as time, date, type')
                ->from('schedule')
                ->where('(user = :user_id OR user = 0) AND month = :ym AND date > 0')
                ->order('date ASC');
        $command->params[':user_id'] = $user;
        $command->params[':ym'] = $ym;
        $workinghours = $command->queryAll();
        
        $commandDefault = Yii::app()->db->createCommand();
        $commandDefault->select('IF(start IS NOT NULL, TIME_TO_SEC(stop) - TIME_TO_SEC(start) - (break*60), 28800) as time, day_of_week, type')
                ->from('schedule')
                ->where('user = :user_id AND month = :ym AND schedule.default = :default')
                ->order('date ASC');
        $commandDefault->params[':user_id'] = $user;
        $commandDefault->params[':ym'] = $ym;
        $commandDefault->params[':default'] = 1;
        $defaultworkinghours = $commandDefault->queryAll();
        
        $dates = array();
        $i = 0;
        $total = 0;
        $dayTypes = array();
        foreach($workinghours as $workinghour) {
            if($workinghour['type'] == Schedule::TYPE_WORKING || $workinghour['type'] == Schedule::TYPE_DAY_OFF)
                $dates[$workinghour['date']] = $workinghour['time'];
            else
                $dates[$workinghour['date']] = 0;
            $dayTypes[$workinghour['date']] = $workinghour['type'];
        }
        if(empty($defaultworkinghours)) {
            for($i = 1; $i <= $daysInMonth; $i++) {
                $day = "$year-$month-$i";
                if(!isset($dates[$i])) {
                    if(date("D", strtotime($day)) != 'Sun' && date("D", strtotime($day)) != 'Sat') {
                        $dates[$i] = 28800;
                        $dayTypes[$i] = Schedule::TYPE_WORKING;
                    } else {
                        $dayTypes[$i] = Schedule::TYPE_HOLIDAY;
                        $dates[$i] = 0;
                    }
                }
                $total += $dates[$i];
            }
        } else {
            $diffDays = date('w', strtotime("$year-$month-1")) - 1;
            for($i = 0; $i <= 28; $i = $i + 7) {
                foreach($defaultworkinghours as $default) {
                    $dayWeek = $default['day_of_week'] + $i - $diffDays;
                    if($dayWeek <= 0)
                        continue;
                    if($dayWeek > $daysInMonth)
                        break 2;
                    $day = "$year-$month-$dayWeek";
                    if(!isset($dates[$dayWeek])) {
                        if($default['type'] == Schedule::TYPE_WORKING || $default['type'] == Schedule::TYPE_DAY_OFF) {
                            $dates[$dayWeek] = 28800;
                        } else {
                            $dates[$dayWeek] = 0;
                        }
                    }
                    $total += $dates[$dayWeek];
                }
            }
        }
        return array('total' => $total, 'day_types' => $dayTypes);
    }

    /**
     * Return statistic of team(or all users if current user is admin)
     * Expect required $_POST['year']
     * Expect required $_POST['month']
     * Return [userId => ['user' => ['id' => userId, 'name' => userName], ['days' => [date => ['day' => dayOfWeek, 'time' => totalWorkTime, 'break' => breakTime], ... ]], ... ]
     */
    public function actionStatistic()
    {
        $year = intval(Yii::app()->request->getPost('year', date('Y')));
        $month = intval(Yii::app()->request->getPost('month', date('m')));
        $user = Yii::app()->request->getPost('user', false);
        if ($month < 10)
            $month = '0' . $month;
        
        if ($user) {
            
            if(!in_array(Yii::app()->user->getUser()->type, array(User::ROLE_MANAGER, User::ROLE_ADMIN)) && $user != Yii::app()->user->getUser()->id)
            {
                echo json_encode(array('success' => false, 'error' => Yii::t('statistic', 'User is not a manager/admin')));
                Yii::app()->end();
            }
            
            if(Yii::app()->user->getUser()->type == User::ROLE_MANAGER && !$this->checkDepartment($user))
            {
                echo json_encode(array('success' => false, 'error' => Yii::t('statistic', 'User is from another department')));
                Yii::app()->end();
            }
            
            $userCriteria = new CDbCriteria();
            $userCriteria->addCondition('id = :uid');
            $userCriteria->params[':uid'] = $user;
            $users = User::model()->findAll($userCriteria);
            if(empty($users))
            {
                echo json_encode(array('success' => false, 'error' => Yii::t('statistic', 'Specified user doesn\'t exist')));
                Yii::app()->end();
            }
        }else{
            //if POST 'user' not  exist
            $user = Yii::app()->user->getUser()->id;
            $dep_id = Department::getDep($user);
            $users = Yii::app()->user->getUser()->type == User::ROLE_ADMIN ? User::getAllActiveUser($year, $month, $user, $this->showHidden) : ( Yii::app()->user->getUser()->type == User::ROLE_MANAGER ? User::getUsersFromDepartment($user, $dep_id, false, NULL, $year, $month, $user, false, $this->showHidden) : User::model()->findAll('id = :user_id AND is_hidden = :is_hidden', array(':user_id' => $user, ':is_hidden' => $this->showHidden)));
        }
        
        $days_in_month = UserTime::getCountOfDay($year, $month);
        $days = array();
        for ($i = 1; $i <= $days_in_month; $i++)
        {
            $days[$i] = $i;
        }
        $result = array();
        
        $i = 0;
        foreach ($users as $depUser)
        {
            $workingHours = self::workingHoursAndDayType($depUser->id, $year, $month);
            $result[$i]['user']['id'] = $depUser->id;
            $result[$i]['user']['name'] = $depUser->name;
            $result[$i]['user']['working_hours'] = $workingHours['total'];
            $monthlyTime = 0;
            foreach ($days as $day)
            {
                $dayType = $workingHours['day_types'][$day];
                if ($day < 10)
                    $day = '0' . $day;
                $data = UserTime::getData($depUser->id, $year . '-' . $month . '-' . $day);
                $date = $year . '-' . $month . '-' . $day;
                $weekDay = date('l', strtotime($year . '-' . $month . '-' . $day));
                $time = !empty($data[0]['worked']) ? $data[0]['worked'] : 0;
                $monthlyTime += $time;
                $break = UserTime::timeAllBreak($year . '-' . $month . '-' . $day, $depUser->id);
                $result[$i]['user']['days'][] = array('day' => $weekDay, 'time' => $time, 'break' => $break, 'date' => $date, 'day_type' => $dayType);
            }
            $result[$i]['user']['monthly_time'] = $monthlyTime;
            $i++;
        }
        
        echo json_encode(array('success' => true, 'data' => $result));
    }


    
    /**
     * Return ['success' => true, 'token' => token]
     */
    public function actionGenerateLoginToken()
    {
        $user = Yii::app()->user->getUser();
        $user->login_token = Yii::app()->securityManager->generateRandomString(32);
        $user->login_token_created = date('Y-m-d H:i:s');
        $user->save(false);
        echo json_encode(array('success' => true, 'token' => $user->login_token));
    }
}