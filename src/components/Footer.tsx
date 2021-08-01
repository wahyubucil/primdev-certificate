import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { VFC } from 'react';
import './Footer.scss';

export const Footer: VFC<{ withPadding?: boolean }> = ({
  withPadding = true,
}) => (
  <div
    className={classNames(['Footer', { 'Footer--with-padding': withPadding }])}
  >
    <div className="Footer__links">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/primakara-developers"
      >
        Primakara Developers
      </a>
      <a
        title="github"
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/wahyubucil/primdev-certificate"
      >
        <GithubOutlined />
      </a>
      <a target="_blank" rel="noopener noreferrer" href="https://nextap.co">
        Nextap &amp; Company
      </a>
    </div>
    <div>
      <CopyrightOutlined /> {new Date().getFullYear()} Created by{' '}
      <a
        href="https://wahyubucil.web.app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Wahyu Budi Saputra
      </a>
    </div>
  </div>
);
