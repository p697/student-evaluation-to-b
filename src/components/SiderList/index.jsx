import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions'
import { Menu, Badge } from 'antd';
import simplify from '../../utils/simplify'

import './index.scss'

const { SubMenu } = Menu;

function SiderList(props) {
  const { role, userAcademyId, userLevel, siderData = [], type, academyId, clazzId, level, academyName, clazzName, getAllAcademy, getAllMajor } = props

  const unitName = role === 1 ? clazzName : academyName
  const unitId = role === 1 ? clazzId : academyId

  if (role !== 1 && siderData.length !== 0 && siderData[0].academy.id !== 0) {
    siderData.unshift({
      academy: { id: 0, academyName: '全部学院' },
      levelVOs: [{ level: null, count: null, upload: true }, { level: 2016, count: null, upload: true }, { level: 2017, count: null, upload: true }, { level: 2018, count: null, upload: true }, { level: 2019, count: null, upload: true }]
    })
  }


  useEffect(() => {
    if (role === 1) {
      getAllMajor(userAcademyId)
    }
    else {
      getAllAcademy(type)
    }
  }, [role, userAcademyId, type, getAllAcademy, getAllMajor])

  const handleClick = (e) => {
    props.onClick(JSON.parse(e.key))
  }

  return (
    <div className='siderList'>
      <div className='siderList-scroll'>
        <Menu
          mode="inline"
          selectedKeys={[JSON.stringify({ unitId: unitId, level: level, unitName: unitName })]}
          onClick={(e) => handleClick(e)}
          style={{ width: 200, height: '100%' }}
        >
          {
            role === 1 ?
              <Menu.Item key={JSON.stringify({ unitId: 0, level: level, unitName: '所有专业' })}>
                <div className="siderList-titleBox">所有专业</div>
              </Menu.Item>
              : null
          }
          {
            siderData.map((item) => {
              let levelVOs = []
              let clazzList = []
              let unitId, unitName, title
              let countSum = 0
              let noUploadSum = 0
              if (role === 1) {
                const { major } = item
                clazzList = item.clazzList
                unitId = major.id
                unitName = major.majorName
                title = simplify(major.majorName)
              }
              else {
                const { academy } = item
                levelVOs = item.levelVOs
                unitId = academy.id
                unitName = academy.academyName
                title = simplify(academy.academyName)
                levelVOs.map(levelInfo => {
                  countSum += levelInfo.count
                  if (!levelInfo.upload) { noUploadSum++ }
                  return null
                })
              }

              switch (type) {
                case ('studentInfo'):
                  title = <div className="siderList-titleBox">{title} <Badge className="siderList-titleBox-badge" count={noUploadSum} /></div>
                  break;
                case ('evalSchedule'):
                  title = <div className="siderList-titleBox">{title} <Badge className="siderList-titleBox-badge" count={countSum} /></div>
                  break;
                default:
                  break
              }

              return (
                <SubMenu key={unitId} title={title}>
                  {
                    role === 1
                      ?
                      clazzList.map(clazzInfo => {
                        let { clazzName: unitName, id: unitId, level } = clazzInfo
                        unitName = simplify(unitName)
                        if (clazzInfo.level !== userLevel) {
                          return null
                        }
                        return <Menu.Item key={JSON.stringify({ unitId: unitId, level: level, unitName: unitName })}>
                          <div className="siderList-titleBox">{unitName}</div>
                        </Menu.Item>
                      })
                      :
                      levelVOs.map(levelInfo => {
                        const { level, count, upload } = levelInfo
                        let showCount = 0
                        switch (type) {
                          case ('studentInfo'):
                            showCount = !upload ? 1 : 0
                            break;
                          case ('evalSchedule'):
                            showCount = count
                            break;
                          default:
                            break
                        }
                        const name = level ? level + '级' : '全部年级'
                        return <Menu.Item key={JSON.stringify({ unitId: unitId, level: level, unitName: unitName })}>
                          <div className="siderList-titleBox">{name} <Badge className="siderList-titleBox-badge" count={showCount} /></div>
                        </Menu.Item>
                      })
                  }
                </SubMenu>
              )
            })
          }
        </Menu>
      </div>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    siderData: state.siderList.siderData,
    role: state.login.role,
    userAcademyId: state.login.academyId,
    userLevel: state.login.level,
  };
}

export default connect(mapStateToProps, actions)(SiderList);
