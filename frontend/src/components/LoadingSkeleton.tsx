"use client";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
const LoadingSkeleton = () => {
    return <Skeleton count={10} />
};

export default LoadingSkeleton;
