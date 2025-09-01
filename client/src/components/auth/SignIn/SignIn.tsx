"use client"
import React from 'react'
import { LoginTabs } from './SignInTabs'
import Link from 'next/link'
import { CONFIG } from '@/config/_config'

function SignIn() {
  return (
     <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg ">
        <h2 className="text-2xl font-semibold text-center">Sign In</h2>
        <LoginTabs />
        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href={CONFIG.CONSTANT.ROUTES.SIGNUP} className="text-black underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
  )
}

export default SignIn