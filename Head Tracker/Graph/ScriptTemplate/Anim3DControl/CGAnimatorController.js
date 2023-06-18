/**
 * @file CGAnimatorController.js
 * @author xuyuan
 * @date 2021/10/14
 * @brief CGAnimatorController.js
 * @copyright Copyright (c) 2021, ByteDance Inc, All Rights Reserved
 */

const Amaz = effect.Amaz;
const {BaseNode} = require('./BaseNode');

class CGAnimatorController extends BaseNode {
  constructor() {
    super();
    this.component = null;
    this.animationList = new Array();
    this.animationSize = 0;
    this.currentClip = null;
    this.loops = 0;
    this.currentLoop = 0;
    this.infinity = false;
    this.errorConfig = false;
    this.stayLastFrame = false;
    this.finish = false;
    this.sys = null;
    this.state = '';
    this.chosenIndex = -1;
    this.haveRegisteredListener = false;
  }

  beforeStart(sys) {
    this.sys = sys;
  }

  onUpdate(dt){
    if(this.inputs[2]() != null){
      this.updateEventListener(this.sys);
    }
  }

  updateEventListener(sys){
    this.haveRegisteredListener = sys.eventListener.haveRegistered(
      Amaz.AnimazEventType.ANIM_END, 
      this.currentClip, 
      sys.script,
      'onCallBack'
    )
    if(!this.haveRegisteredListener){
      this.registerEventListener(this.sys);
    }
    else if(this.chosenIndex != this.inputs[3]()){
      sys.eventListener.removeListener(sys.script, 
        Amaz.AnimazEventType.ANIM_END, 
        this.currentClip, 
        sys.script);
      this.registerEventListener(this.sys);
    }
  }

  registerEventListener(sys) {
    this.component = this.inputs[2]();
    this.errorConfig = false;
    if (this.component == null || this.component.isInstanceOf('Animator') === false) {
      this.errorConfig = true;
      return;
    }
    this.loops = this.inputs[4]();
    if (this.loops === 0) {
      this.errorConfig = true;
      return;
    }
    if (this.loops === -1) {
      this.infinity = true;
    }
    this.stayLastFrame = this.inputs[5]();
    this.animationList = this.component.animations;
    this.animationSize = this.animationList.size();
    if (this.animationSize < 1) {
      this.errorConfig = true;
      return;
    }
    let prevClip = this.currentClip;
    this.chosenIndex = this.inputs[3]();
    if (this.chosenIndex >= this.animationSize || this.chosenIndex < 0) {
      this.errorConfig = true;
      return;
    }
    let chooseAnim = this.animationList.get(this.chosenIndex);
    if (!chooseAnim) {
      this.errorConfig = true;
      return;
    }
    this.currentClip = chooseAnim.getClip('', this.component);
    if (!this.currentClip) {
      this.errorConfig = true;
      return;
    }
    sys.eventListener.registerListener(sys.script, 
      Amaz.AnimazEventType.ANIM_END, 
      this.currentClip, 
      sys.script);
    this.haveRegisteredListener = true;
  }

  execute(index) {
    this.component = this.inputs[2]();
    if(this.component != null){
      this.updateEventListener(this.sys);
    }
    if (this.errorConfig) {
      return;
    }
    
    if (index === 0) {
      this.finish = false;
      this.currentLoop = 0;
      let clipPlaySpeed = this.currentClip.getSpeed();
      this.component.schedule(this.currentClip, 1, clipPlaySpeed);
      this.state = 'play';

      // replay if already start
      if (this.nexts[1]) {
        this.nexts[1]();
      }
    } else if (index === 1) {
      this.component.unschedule(this.currentClip);
      //this.currentClip.stop();
      this.state = 'stop';
      if (this.nexts[2]) {
        this.nexts[2]();
      }
    }

    if (this.nexts[0]) {
      this.nexts[0]();
    }
    // else if (index === 2) {
    //   if (this.state !== 'play' && this.state !== 'resume') {
    //     return;
    //   }
    //   this.state = 'pause';
    //   //this.component.unschedule(this.currentClip);
    //   //this.component.pauseAnimator();
    //   this.currentClip.pause();
    // } else if (index === 3) {
    //   if (this.state !== 'pause') {
    //     return;
    //   }
    //   this.state = 'resume';
    //   let clipPlaySpeed = this.currentClip.getSpeed();
    //   //this.component.schedule(this.currentClip, 1, clipPlaySpeed);
    //   //this.component.resumeAnimator();
    //   this.currentClip.play();
    // }
  }

  onCallBack(sys, clip, eventType) {
    if (eventType === Amaz.AnimazEventType.ANIM_END) {
      if (clip.equals(this.currentClip) && this.state !== 'stop') {
        this.currentLoop = this.currentLoop + 1;
        if (this.currentLoop >= this.loops && false === this.infinity) {
          this.component.unschedule(this.currentClip);
          this.finish = true;
        } else {
          let clipPlaySpeed = this.currentClip.getSpeed();
          this.component.schedule(this.currentClip, 1, clipPlaySpeed);
        }
      }
    }
  }

  onLateUpdate(dt) {
    if (this.finish) {
      if (this.nexts[3]) {
        this.nexts[3]();
      }
      this.finish = false;
    }
  }

  onDestroy(sys) {}
}

exports.CGAnimatorController = CGAnimatorController;
