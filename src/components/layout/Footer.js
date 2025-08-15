import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        고객센터 : 1599-1579 (상담시간 10:00 ~ 17:00) / 이메일 :
        aibiz@aibiz.co.kr / 팩스 : 031-274-4767
        <br />
        Copyrights © 2017 AIBIZ All Rights Reserved.
      </div>
    </div>
  );
}
